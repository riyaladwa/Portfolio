import { NextResponse } from 'next/server.js';
import clientPromise from '../../../lib/mongodb.js';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

// Rate Limiter: Map of IP -> array of timestamps
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 submissions per 15 minutes

function isRateLimited(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = rateLimitMap.get(ip) || [];

  // Filter out timestamps outside the active window
  const activeTimestamps = timestamps.filter((ts) => ts > windowStart);

  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, activeTimestamps);
    return true;
  }

  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);

  // Periodically clean up old IPs from the map
  if (rateLimitMap.size > 1000) {
    for (const [key, list] of rateLimitMap.entries()) {
      const recent = list.filter((ts) => ts > windowStart);
      if (recent.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, recent);
      }
    }
  }

  return false;
}

// Helper to escape HTML characters for safe inclusion in email HTML
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Local serverless fallback cache
const MESSAGES_FILE = path.join('/tmp', 'messages.json');
const saveToLocalFallback = (newMessage) => {
  try {
    let messages = [];
    if (fs.existsSync(MESSAGES_FILE)) {
      const fileData = fs.readFileSync(MESSAGES_FILE, 'utf8');
      try {
        messages = JSON.parse(fileData);
      } catch {
        messages = [];
      }
    }
    messages.push(newMessage);
    const dir = path.dirname(MESSAGES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    console.log('[Fallback Cache] Saved message successfully to /tmp/messages.json');
  } catch (error) {
    console.error('[Fallback Cache Error] Failed to write to temp directory:', error.message);
  }
};

export async function POST(req) {
  try {
    // 1. IP Rate Limiting Check
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'anonymous-client';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please wait a few minutes before submitting another message.',
        },
        { status: 429 }
      );
    }

    // 2. Parse and Validate Request Payload
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request payload.' },
        { status: 400 }
      );
    }

    const { name, email, subject, message, honeypot } = body;

    // Spam Protection: Honeypot field must be empty
    if (honeypot && String(honeypot).trim() !== '') {
      console.warn(`[Spam Guard] Rejected honeypot submission from IP: ${ip}`);
      return NextResponse.json(
        { success: false, error: 'Invalid submission detected.' },
        { status: 400 }
      );
    }

    // Full Name Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Full name is required.' },
        { status: 400 }
      );
    }
    if (name.trim().length > 100) {
      return NextResponse.json(
        { success: false, error: 'Name must be 100 characters or less.' },
        { status: 400 }
      );
    }

    // Email Address Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }
    if (email.trim().length > 254) {
      return NextResponse.json(
        { success: false, error: 'Email address exceeds maximum length.' },
        { status: 400 }
      );
    }

    // Subject Validation
    if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Subject is required.' },
        { status: 400 }
      );
    }
    if (subject.trim().length > 200) {
      return NextResponse.json(
        { success: false, error: 'Subject must be 200 characters or less.' },
        { status: 400 }
      );
    }

    // Message Validation (reject empty or whitespace-only)
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message cannot be empty.' },
        { status: 400 }
      );
    }
    if (message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Message must be at least 10 characters long.' },
        { status: 400 }
      );
    }
    if (message.trim().length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Message must be 5000 characters or less.' },
        { status: 400 }
      );
    }

    const cleanData = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      created_at: new Date().toISOString(),
    };

    // 3. PERSISTENCE IN MONGODB (if configured)
    let mongoDocId = null;
    let messagesCollection = null;

    if (process.env.MONGODB_URI && clientPromise) {
      try {
        console.log('[MongoDB Driver] Connecting to database cluster...');
        const client = await clientPromise;
        const db = client.db('portfolio');
        messagesCollection = db.collection('messages');

        const insertResult = await messagesCollection.insertOne({
          ...cleanData,
          email_delivery_status: 'pending',
        });
        mongoDocId = insertResult.insertedId;
        console.log('[MongoDB Driver] Message stored with pending delivery status. ID:', mongoDocId);
      } catch (dbErr) {
        console.error('[MongoDB Driver Error] Database insert failed:', dbErr.message);
        // We continue to send email even if DB connection fails, ensuring owner gets the message
      }
    }

    // 4. EMAIL DELIVERY DISPATCH
    const recipientEmail = process.env.EMAIL_TO || process.env.EMAIL_USER || 'riyaladwa9@gmail.com';
    const emailSubject = `[Portfolio] ${cleanData.subject} - from ${cleanData.name}`;

    const submissionDateIST = new Date(cleanData.created_at).toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });
    const submissionDateUTC = new Date(cleanData.created_at).toUTCString();

    const plainTextContent = `New message received from your Portfolio website.

--------------------------------------------------
Sender Name:    ${cleanData.name}
Sender Email:   ${cleanData.email}
Subject:        ${cleanData.subject}
Submission Time: ${submissionDateIST} (IST) / ${submissionDateUTC} (UTC)
--------------------------------------------------

Message:
${cleanData.message}

--------------------------------------------------
Reply directly to this email to respond to ${cleanData.name} (${cleanData.email}).
`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Portfolio Message</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F9F9FB; margin: 0; padding: 24px; color: #121212;">
  <div style="max-width: 620px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
    
    <div style="background-color: #121212; padding: 24px 32px; color: #FFFFFF;">
      <span style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #A0A0A0; font-weight: 700; display: block; margin-bottom: 6px;">PORTFOLIO CONTACT FORM</span>
      <h1 style="font-size: 20px; margin: 0; font-weight: 800; letter-spacing: -0.5px; color: #FFFFFF;">New Message from ${escapeHtml(cleanData.name)}</h1>
    </div>

    <div style="padding: 32px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 8px 0; color: #777777; font-size: 13px; width: 110px; font-weight: 600;">SENDER:</td>
          <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #121212;">${escapeHtml(cleanData.name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #777777; font-size: 13px; font-weight: 600;">EMAIL:</td>
          <td style="padding: 8px 0; font-size: 14px;">
            <a href="mailto:${escapeHtml(cleanData.email)}" style="color: #121212; text-decoration: underline; font-weight: 600;">${escapeHtml(cleanData.email)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #777777; font-size: 13px; font-weight: 600;">SUBJECT:</td>
          <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #121212;">${escapeHtml(cleanData.subject)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #777777; font-size: 13px; font-weight: 600;">DATE & TIME:</td>
          <td style="padding: 8px 0; font-size: 13px; color: #555555;">${submissionDateIST} (IST)</td>
        </tr>
      </table>

      <div style="margin-top: 16px;">
        <span style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #777777; font-weight: 700; display: block; margin-bottom: 8px;">MESSAGE:</span>
        <div style="background-color: #F4F2EB; border-left: 4px solid #121212; border-radius: 8px; padding: 18px; font-size: 14px; line-height: 1.7; color: #121212; white-space: pre-wrap; font-family: inherit;">${escapeHtml(cleanData.message)}</div>
      </div>

      <div style="margin-top: 32px; text-align: center;">
        <a href="mailto:${escapeHtml(cleanData.email)}?subject=Re:%20${encodeURIComponent(cleanData.subject)}" style="display: inline-block; background-color: #121212; color: #FFFFFF; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-decoration: none; padding: 12px 24px; border-radius: 9999px;">
          REPLY TO ${escapeHtml(cleanData.name.toUpperCase())} &rarr;
        </a>
      </div>
    </div>

    <div style="background-color: #F9F9FB; border-top: 1px solid #E5E7EB; padding: 16px 32px; font-size: 11px; color: #888888; text-align: center;">
      This email was delivered securely from your personal portfolio website (riyaladwa.dev).
    </div>

  </div>
</body>
</html>
`;

    let emailDelivered = false;
    let deliveryMessageId = null;
    let emailDeliveryError = null;

    // Check Option A: Resend API (Preferred for cloud edge/serverless without SMTP timeouts)
    if (process.env.RESEND_API_KEY) {
      try {
        console.log('[Email Dispatcher] Attempting delivery via Resend...');
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromAddress = process.env.RESEND_FROM || 'Portfolio Contact <onboarding@resend.dev>';

        const resendResponse = await resend.emails.send({
          from: fromAddress,
          to: recipientEmail,
          replyTo: cleanData.email,
          subject: emailSubject,
          text: plainTextContent,
          html: htmlContent,
        });

        if (resendResponse.error) {
          throw new Error(resendResponse.error.message || 'Resend API returned an error');
        }

        emailDelivered = true;
        deliveryMessageId = resendResponse.data?.id || 'resend-ok';
        console.log('[Email Dispatcher] Sent successfully via Resend. ID:', deliveryMessageId);
      } catch (resendErr) {
        console.error('[Email Dispatcher Error] Resend dispatch failed:', resendErr.message);
        emailDeliveryError = resendErr.message;
      }
    }

    // Check Option B: Nodemailer SMTP (e.g. Gmail App Password)
    // Runs if Resend is not configured or if Resend failed and SMTP credentials exist
    if (!emailDelivered && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        console.log('[Email Dispatcher] Attempting delivery via Nodemailer SMTP...');
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000,
        });

        const mailOptions = {
          from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
          to: recipientEmail,
          replyTo: cleanData.email,
          subject: emailSubject,
          text: plainTextContent,
          html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        emailDelivered = true;
        deliveryMessageId = info.messageId;
        console.log('[Email Dispatcher] Sent successfully via Nodemailer. ID:', info.messageId);
      } catch (smtpErr) {
        console.error('[Email Dispatcher Error] Nodemailer SMTP dispatch failed:', smtpErr.message);
        emailDeliveryError = smtpErr.message;
      }
    }

    // 5. UPDATE DATABASE WITH ACCURATE DELIVERY STATUS
    if (mongoDocId && messagesCollection) {
      try {
        if (emailDelivered) {
          await messagesCollection.updateOne(
            { _id: mongoDocId },
            {
              $set: {
                email_delivery_status: 'sent',
                email_message_id: deliveryMessageId,
                delivered_at: new Date().toISOString(),
              },
            }
          );
        } else {
          await messagesCollection.updateOne(
            { _id: mongoDocId },
            {
              $set: {
                email_delivery_status: 'failed',
                email_error: emailDeliveryError || 'No email provider succeeded',
                failed_at: new Date().toISOString(),
              },
            }
          );
        }
      } catch (updateErr) {
        console.error('[MongoDB Driver Error] Failed to update delivery status:', updateErr.message);
      }
    }

    // 6. ALWAYS SAVE TO LOCAL FALLBACK CACHE FOR LOGGING
    saveToLocalFallback({
      id: Date.now().toString(),
      ...cleanData,
      email_delivery_status: emailDelivered ? 'sent' : 'failed',
      email_message_id: deliveryMessageId,
      email_error: emailDeliveryError,
    });

    // 7. RESPOND TO CLIENT GRACEFULLY
    // If message was saved to MongoDB Atlas, count as success!
    if (mongoDocId) {
      return NextResponse.json({
        success: true,
        savedToDatabase: true,
        emailDelivered: Boolean(emailDelivered),
        message: 'Message sent successfully! Thank you, Riya will get back to you shortly.',
      });
    }

    // If email delivered successfully via Resend or Nodemailer
    if (emailDelivered) {
      return NextResponse.json({
        success: true,
        emailDelivered: true,
        message: 'Message sent successfully! Thank you, Riya will get back to you shortly.',
      });
    }

    // If neither DB nor email credentials are active on host (e.g. initial deployment without env vars),
    // provide an instant direct email client link pre-filled with the user's message.
    const directMailto = `mailto:riyaladwa9@gmail.com?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(
      `Hi Riya,\n\n${cleanData.message}\n\n---\nName: ${cleanData.name}\nEmail: ${cleanData.email}\nDate: ${submissionDateIST}`
    )}`;

    return NextResponse.json({
      success: true,
      fallbackRequired: true,
      mailto: directMailto,
      message: 'Your message has been captured! To ensure immediate delivery, you can also send it directly via your mail client below.',
    });
  } catch (error) {
    console.error('[API Error] Unhandled exception in contact submission:', error.message);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
