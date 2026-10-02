import { NextResponse } from 'next/server.js';
import { getDatabase } from '../../../lib/mongodb.js';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

// In-memory Rate Limiter: Max 5 submissions per 15 minutes per IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = rateLimitMap.get(ip) || [];

  const activeTimestamps = timestamps.filter((ts) => ts > windowStart);

  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, activeTimestamps);
    return true;
  }

  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);

  // Periodically clean up old IPs
  if (rateLimitMap.size > 1000) {
    for (const [key, list] of rateLimitMap.entries()) {
      const recent = list.filter((ts) => ts > windowStart);
      if (recent.length === 0) rateLimitMap.delete(key);
      else rateLimitMap.set(key, recent);
    }
  }

  return false;
}

// Anonymize IP for privacy
function anonymizeIp(ip) {
  if (!ip || ip === 'anonymous-client') return 'anonymous';
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) return `${parts[0]}.${parts[1]}.xxx.xxx`;
  }
  return 'masked-ip';
}

// Strip newline characters to prevent email header injection
function sanitizeHeader(input) {
  if (!input) return '';
  return String(input).replace(/[\r\n\t]/g, ' ').trim();
}

// Escape HTML for email body
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Diagnose and classify MongoDB errors accurately without leaking secrets
function diagnoseDatabaseError(err) {
  const code = err?.code;
  const name = err?.name;
  const rawMsg = err?.message || '';

  // 1. Missing environment variable
  if (code === 'CONFIG_MISSING' || !process.env.MONGODB_URI) {
    return {
      type: 'CONFIG_MISSING',
      log: '[MongoDB Config Error] MONGODB_URI environment variable is not defined on the server.',
      userError: 'Database service is temporarily unconfigured. Please ensure MONGODB_URI is set in the hosting dashboard.',
      status: 503,
    };
  }

  // 2. Authentication failure (bad username or password)
  if (code === 8000 || rawMsg.includes('Authentication failed') || rawMsg.includes('bad auth')) {
    return {
      type: 'AUTH_FAILED',
      log: `[MongoDB Auth Error] Authentication failed for database user (code: ${code || '8000'}). Verify user and password in MONGODB_URI.`,
      userError: 'Database authentication failed. Please verify database user credentials in project settings.',
      status: 500,
    };
  }

  // 3. Network Access / IP Whitelist / Connection Timeout
  if (
    name === 'MongoServerSelectionError' ||
    name === 'MongoNetworkTimeoutError' ||
    rawMsg.includes('Server selection timed out') ||
    rawMsg.includes('ETIMEDOUT') ||
    rawMsg.includes('timed out after') ||
    rawMsg.includes('connection timed out')
  ) {
    return {
      type: 'NETWORK_TIMEOUT',
      log: `[MongoDB Network Timeout] Server selection timed out (${rawMsg}). Root cause: The server IP is likely blocked by MongoDB Atlas Network Access. In MongoDB Atlas > Network Access, add 0.0.0.0/0 to allow connections from cloud hosting (e.g., Vercel).`,
      userError: 'Database connection timed out. Please check that MongoDB Atlas Network Access allows traffic from anywhere (0.0.0.0/0).',
      status: 504,
    };
  }

  // 4. DNS / Host Resolution Failure
  if (rawMsg.includes('ENOTFOUND') || rawMsg.includes('ECONNREFUSED') || rawMsg.includes('querySrv ENOTFOUND')) {
    return {
      type: 'DNS_NETWORK_REFUSED',
      log: `[MongoDB DNS/Connection Error] Unable to resolve cluster hostname: ${rawMsg}. Check cluster address in MONGODB_URI.`,
      userError: 'Unable to reach the MongoDB Atlas cluster. Please verify the cluster hostname.',
      status: 503,
    };
  }

  // 5. Document Insertion / Validation / Write Error
  if (name === 'MongoWriteException' || name === 'MongoBulkWriteError' || code === 11000 || rawMsg.includes('insertOne')) {
    return {
      type: 'INSERTION_ERROR',
      log: `[MongoDB Insertion Error] Failed to write document into collection: ${rawMsg} (code: ${code || 'N/A'}).`,
      userError: 'Failed to insert message into database. Please try again.',
      status: 500,
    };
  }

  // 6. General Database Error
  return {
    type: 'DATABASE_ERROR',
    log: `[MongoDB General Error] ${rawMsg} (name: ${name || 'N/A'}, code: ${code || 'N/A'}).`,
    userError: 'A database error occurred while processing your request. Please reach out directly to riyaladwa9@gmail.com.',
    status: 500,
  };
}

// Local serverless fallback cache (safety net)
const MESSAGES_FILE = path.join('/tmp', 'messages.json');
const saveToLocalFallback = (doc) => {
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
    messages.push(doc);
    const dir = path.dirname(MESSAGES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    console.log('[Fallback Cache] Saved message to /tmp/messages.json');
  } catch (err) {
    console.error('[Fallback Cache Error] Failed to write fallback:', err.message);
  }
};

// Handle CORS Pre-flight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req) {
  try {
    // --------------------------------------------------------------------------
    // 1. RATE LIMITING & PAYLOAD VALIDATION
    // --------------------------------------------------------------------------
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'anonymous-client';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many submissions. Please wait 15 minutes before submitting again.',
        },
        { status: 429 }
      );
    }

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

    // Honeypot spam check
    if (honeypot && String(honeypot).trim() !== '') {
      console.warn(`[Spam Guard] Rejected honeypot submission from IP: ${ip}`);
      return NextResponse.json(
        { success: false, error: 'Invalid submission detected.' },
        { status: 400 }
      );
    }

    // Name Validation
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

    // Email Validation (RFC 5322 simplified standard regex)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }
    if (email.trim().length > 254) {
      return NextResponse.json(
        { success: false, error: 'Email address exceeds maximum permitted length.' },
        { status: 400 }
      );
    }

    // Subject Validation (optional, default provided if omitted)
    const cleanSubject = subject && typeof subject === 'string' && subject.trim().length > 0
      ? sanitizeHeader(subject.trim().substring(0, 200))
      : 'Portfolio Inquiry';

    // Message Validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message cannot be empty.' },
        { status: 400 }
      );
    }
    if (message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Message must be at least 5 characters long.' },
        { status: 400 }
      );
    }
    if (message.trim().length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Message exceeds maximum limit of 5,000 characters.' },
        { status: 400 }
      );
    }

    const cleanData = {
      name: sanitizeHeader(name.trim()),
      email: sanitizeHeader(email.trim().toLowerCase()),
      subject: cleanSubject,
      message: message.trim(),
    };

    // --------------------------------------------------------------------------
    // 2. SAVE MESSAGE TO MONGODB ATLAS (First Stage of Transaction)
    // --------------------------------------------------------------------------
    let mongoDocId = null;
    let messagesCollection = null;

    try {
      console.log('[MongoDB Atlas] Connecting to database...');
      const db = await getDatabase('portfolio');
      messagesCollection = db.collection('messages');

      // Create new document with required schema
      const newDocument = {
        name: cleanData.name,
        email: cleanData.email,
        subject: cleanData.subject,
        message: cleanData.message,
        createdAt: new Date(),
        created_at: new Date().toISOString(), // Maintained for backward compatibility
        emailStatus: 'pending',
        deliveryError: null,
        emailMessageId: null,
        ip: anonymizeIp(ip),
        userAgent: req.headers.get('user-agent')?.substring(0, 200) || 'unknown',
      };

      const insertResult = await messagesCollection.insertOne(newDocument);
      mongoDocId = insertResult.insertedId;
      console.log('[MongoDB Atlas] Message stored successfully! Document ID:', mongoDocId.toString());

      // Ensure helpful index asynchronously
      messagesCollection.createIndex({ createdAt: -1 }).catch(() => {});
    } catch (dbErr) {
      const diagnostic = diagnoseDatabaseError(dbErr);
      console.error(diagnostic.log);
      
      // Save to local emergency cache
      saveToLocalFallback({
        ...cleanData,
        createdAt: new Date().toISOString(),
        db_error: diagnostic.type,
      });

      // Return distinct, safe error to frontend
      return NextResponse.json(
        {
          success: false,
          error: diagnostic.userError,
          errorType: diagnostic.type,
        },
        { status: diagnostic.status }
      );
    }

    // --------------------------------------------------------------------------
    // 3. ATTEMPT EMAIL NOTIFICATION DISPATCH (Second Stage)
    // --------------------------------------------------------------------------
    const recipientEmail = process.env.EMAIL_TO || process.env.EMAIL_USER || 'riyaladwa9@gmail.com';
    const emailSubject = `[Portfolio Contact] ${cleanData.subject} - from ${cleanData.name}`;

    const submissionDateIST = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    });
    const submissionDateUTC = new Date().toUTCString();

    const plainTextContent = `New message received from your Portfolio website.

--------------------------------------------------
Sender Name:     ${cleanData.name}
Sender Email:    ${cleanData.email}
Subject:         ${cleanData.subject}
Date & Time:     ${submissionDateIST} (IST) / ${submissionDateUTC} (UTC)
Database Doc ID: ${mongoDocId.toString()}
--------------------------------------------------

Message:
${cleanData.message}

--------------------------------------------------
Reply directly to this email to reply to ${cleanData.name} (${cleanData.email}).
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
    
    <div style="background-color: #121212; padding: 24px 30px; color: #FFFFFF;">
      <span style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #9CA3AF; font-weight: 700; display: block; margin-bottom: 6px;">
        Portfolio Contact Notification
      </span>
      <h1 style="font-size: 22px; font-weight: 800; margin: 0; line-height: 1.2;">
        New Message from ${escapeHtml(cleanData.name)}
      </h1>
    </div>

    <div style="padding: 30px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 8px 0; color: #6B7280; font-size: 12px; font-weight: 700; text-transform: uppercase; width: 110px;">Name</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${escapeHtml(cleanData.name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6B7280; font-size: 12px; font-weight: 700; text-transform: uppercase;">Email</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px;">
            <a href="mailto:${escapeHtml(cleanData.email)}" style="color: #2563EB; text-decoration: underline;">
              ${escapeHtml(cleanData.email)}
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6B7280; font-size: 12px; font-weight: 700; text-transform: uppercase;">Subject</td>
          <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${escapeHtml(cleanData.subject)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6B7280; font-size: 12px; font-weight: 700; text-transform: uppercase;">Submitted</td>
          <td style="padding: 8px 0; color: #4B5563; font-size: 13px;">${submissionDateIST} (IST)</td>
        </tr>
      </table>

      <div style="margin: 20px 0;">
        <span style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #6B7280; font-weight: 700; display: block; margin-bottom: 8px;">
          Message
        </span>
        <div style="background-color: #F4F2EB; border-left: 4px solid #121212; padding: 18px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #1F2937; white-space: pre-wrap;">
${escapeHtml(cleanData.message)}
        </div>
      </div>

      <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #E5E7EB; text-align: center;">
        <a href="mailto:${escapeHtml(cleanData.email)}?subject=${encodeURIComponent('Re: ' + cleanData.subject)}" 
           style="display: inline-block; background-color: #121212; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px;">
          Reply to ${escapeHtml(cleanData.name)} Directly
        </a>
      </div>
    </div>

    <div style="background-color: #F9FAFB; padding: 16px 30px; border-top: 1px solid #E5E7EB; font-size: 11px; color: #9CA3AF; text-align: center;">
      Recorded in MongoDB Atlas Collection <code>portfolio.messages</code> &bull; ID: ${mongoDocId.toString()}
    </div>
  </div>
</body>
</html>
`;

    let emailDelivered = false;
    let emailMessageId = null;
    let emailDeliveryError = null;

    // Option A: Resend API (if configured)
    if (process.env.RESEND_API_KEY) {
      try {
        console.log('[Email Dispatcher] Attempting delivery via Resend HTTP API...');
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromAddress = process.env.RESEND_FROM || process.env.EMAIL_FROM || 'Portfolio <onboarding@resend.dev>';

        const resendResponse = await resend.emails.send({
          from: fromAddress,
          to: recipientEmail,
          reply_to: cleanData.email,
          subject: emailSubject,
          text: plainTextContent,
          html: htmlContent,
        });

        if (resendResponse.error) {
          throw new Error(resendResponse.error.message || 'Resend API returned an error');
        }

        emailDelivered = true;
        emailMessageId = resendResponse.data?.id || 'resend-sent';
        console.log('[Email Dispatcher] Sent via Resend successfully! Message ID:', emailMessageId);
      } catch (resendErr) {
        console.error('[Email Dispatcher Error] Resend failed:', resendErr.message);
        emailDeliveryError = `Resend error: ${resendErr.message}`;
      }
    }

    // Option B: Nodemailer with Gmail SMTP (if Resend wasn't used or failed)
    if (!emailDelivered && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        console.log('[Email Dispatcher] Attempting delivery via Nodemailer Gmail SMTP...');
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

        const senderHeader = `"Portfolio Contact" <${process.env.EMAIL_USER}>`;

        const mailOptions = {
          from: senderHeader,
          to: recipientEmail,
          replyTo: `${cleanData.name} <${cleanData.email}>`,
          subject: emailSubject,
          text: plainTextContent,
          html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        emailDelivered = true;
        emailMessageId = info.messageId;
        console.log('[Email Dispatcher] Sent via Nodemailer successfully! Message ID:', info.messageId);
      } catch (smtpErr) {
        console.error('[Email Dispatcher Error] Nodemailer SMTP failed:', smtpErr.message);
        emailDeliveryError = `SMTP error: ${smtpErr.message}`;
      }
    }

    // --------------------------------------------------------------------------
    // 4. UPDATE MONGODB DOCUMENT WITH EMAIL DELIVERY STATUS
    // --------------------------------------------------------------------------
    if (mongoDocId && messagesCollection) {
      try {
        await messagesCollection.updateOne(
          { _id: mongoDocId },
          {
            $set: {
              emailStatus: emailDelivered ? 'sent' : 'failed',
              deliveryError: emailDeliveryError || null,
              emailMessageId: emailMessageId || null,
              updatedAt: new Date(),
            },
          }
        );
        console.log(`[MongoDB Atlas] Document updated with emailStatus: ${emailDelivered ? 'sent' : 'failed'}`);
      } catch (updateErr) {
        console.error('[MongoDB Atlas Error] Failed to update document status:', updateErr.message);
      }
    }

    // --------------------------------------------------------------------------
    // 5. RETURN STRUCTURED RESPONSE TO CLIENT
    // --------------------------------------------------------------------------
    if (emailDelivered) {
      return NextResponse.json({
        success: true,
        savedToDatabase: true,
        emailDelivered: true,
        messageId: mongoDocId.toString(),
        message: 'Thank you! Your message has been saved and delivered to Riya. She will get back to you shortly.',
      });
    }

    // If message is saved in MongoDB Atlas, but email notification failed or wasn't configured
    return NextResponse.json({
      success: true,
      savedToDatabase: true,
      emailDelivered: false,
      messageId: mongoDocId.toString(),
      message: 'Your message was successfully received and stored in our database! Note: Email notification dispatch may be delayed.',
    });
  } catch (error) {
    console.error('[API Error] Unhandled exception in contact submission:', error.message);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
