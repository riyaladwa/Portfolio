import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MESSAGES_FILE = path.join(process.cwd(), 'data', 'messages.json');

const ensureDatabase = () => {
  const dir = path.dirname(MESSAGES_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));
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

    ensureDatabase();

    const fileData = fs.readFileSync(MESSAGES_FILE, 'utf8');
    const messages = JSON.parse(fileData);

    const newMessage = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    messages.push(newMessage);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));

    console.log(`[Next.js API] Message saved from: ${name} (${email})`);

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('[Next.js API Error] Failed to handle contact submission:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
