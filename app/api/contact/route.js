import { NextResponse } from 'next/server';
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
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    let savedToDatabase = false;
    let dbType = '';

    // 1. SUPABASE REST CONNECTOR
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      try {
        console.log('[Supabase API] Attempting database insert...');
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/messages`, {
          method: 'POST',
          headers: {
            'apikey': process.env.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            name: newMessage.name,
            email: newMessage.email,
            message: newMessage.message,
            created_at: newMessage.timestamp
          }),
        });

        if (response.ok) {
          console.log('[Supabase API] Message saved successfully.');
          savedToDatabase = true;
          dbType = 'Supabase';
        } else {
          const errText = await response.text();
          console.error('[Supabase API Error] Insert failed:', errText);
        }
      } catch (err) {
        console.error('[Supabase Integration Error] Connection failed:', err);
      }
    }

    // 2. MONGODB ATLAS DATA API CONNECTOR
    if (!savedToDatabase && process.env.MONGODB_DATA_API_URL && process.env.MONGODB_DATA_API_KEY) {
      try {
        console.log('[MongoDB Data API] Attempting database insert...');
        const response = await fetch(`${process.env.MONGODB_DATA_API_URL}/action/insertOne`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'api-key': process.env.MONGODB_DATA_API_KEY
          },
          body: JSON.stringify({
            dataSource: process.env.MONGODB_DATA_SOURCE || 'Cluster0',
            database: process.env.MONGODB_DATABASE || 'portfolio',
            collection: process.env.MONGODB_COLLECTION || 'messages',
            document: newMessage
          })
        });

        if (response.ok) {
          console.log('[MongoDB Data API] Message saved successfully.');
          savedToDatabase = true;
          dbType = 'MongoDB';
        } else {
          const errText = await response.text();
          console.error('[MongoDB Data API Error] Insert failed:', errText);
        }
      } catch (err) {
        console.error('[MongoDB Integration Error] Connection failed:', err);
      }
    }

    // Always keep a local copy in /tmp for safety & debugging
    saveToLocalFallback(newMessage);

    return NextResponse.json({ 
      success: true, 
      message: savedToDatabase 
        ? `Message sent and saved to ${dbType}!` 
        : 'Message sent successfully!' 
    });

  } catch (error) {
    console.error('[Next.js API Error] Failed to handle contact submission:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
