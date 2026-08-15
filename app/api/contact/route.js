import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Serverless functions (Vercel/Render) allow writes only in the /tmp directory
const MESSAGES_FILE = path.join('/tmp', 'messages.json');

const saveToLocalFallback = (newMessage) => {
  try {
    let messages = [];
    if (fs.existsSync(MESSAGES_FILE)) {
      const fileData = fs.readFileSync(MESSAGES_FILE, 'utf8');
      try {
        messages = JSON.parse(fileData);
      } catch (e) {
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
    console.error('[Fallback Cache Error] Failed to write to temp directory:', error);
  }
};

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || name.trim() === '') {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ success: false, error: 'Valid email is required' }, { status: 400 });
    }
    if (!message || message.trim() === '') {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    const newMessage = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      created_at: new Date().toISOString(),
    };

    let savedToDatabase = false;

    // 1. MONGODB ATLAS CONNECT
    if (process.env.MONGODB_URI) {
      try {
        console.log('[MongoDB Driver] Connecting to database cluster...');
        const client = await clientPromise;
        const db = client.db('portfolio');
        const collection = db.collection('messages');
        
        await collection.insertOne(newMessage);
        console.log('[MongoDB Driver] Message saved successfully to Atlas database.');
        savedToDatabase = true;
      } catch (err) {
        console.error('[MongoDB Driver Error] Insert failed:', err);
      }
    }

    // 2. GMAIL SMTP NOTIFICATION TRIGGER (via Nodemailer)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        console.log('[Email Transporter] Initializing SMTP connection...');
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_TO || process.env.EMAIL_USER,
          subject: `New message from ${newMessage.name} on Portfolio`,
          text: `You have received a new contact submission from your portfolio website.
          
Sender Name: ${newMessage.name}
Sender Email: ${newMessage.email}
Message:
${newMessage.message}

Date: ${newMessage.created_at}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 12px; color: #121212; background-color: #F9F9FB;">
              <h2 style="font-size: 20px; font-weight: bold; border-bottom: 1px solid #E5E7EB; padding-bottom: 10px; color: #121212; margin-top: 0;">
                New Portfolio Message
              </h2>
              <div style="margin: 20px 0;">
                <p style="margin: 8px 0;"><strong style="color: #555555;">Name:</strong> ${newMessage.name}</p>
                <p style="margin: 8px 0;"><strong style="color: #555555;">Email:</strong> <a href="mailto:${newMessage.email}" style="color: #121212; text-decoration: underline;">${newMessage.email}</a></p>
              </div>
              <div style="margin: 20px 0; background-color: #F4F2EB; padding: 15px; border-radius: 8px; border-left: 4px solid #121212;">
                <p style="margin: 0; font-style: italic; white-space: pre-wrap; line-height: 1.6;">${newMessage.message}</p>
              </div>
              <p style="font-size: 11px; color: #777777; margin-top: 25px; border-top: 1px solid #E5E7EB; padding-top: 10px;">
                Submitted on ${new Date(newMessage.created_at).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} (IST)
              </p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log('[Email Transporter] Notification email sent successfully to:', mailOptions.to);
      } catch (emailErr) {
        console.error('[Email Transporter Error] Failed to send email:', emailErr);
      }
    }

    // Always keep a local copy in /tmp for safety & debugging
    saveToLocalFallback({
      id: Date.now().toString(),
      ...newMessage
    });

    return NextResponse.json({ 
      success: true, 
      message: savedToDatabase 
        ? 'Message sent and stored in MongoDB!' 
        : 'Message sent successfully!' 
    });

  } catch (error) {
    console.error('[Next.js API Error] Failed to handle contact submission:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
