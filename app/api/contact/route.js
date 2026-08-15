import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
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
