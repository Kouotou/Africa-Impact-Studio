// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Simple backend validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // XSS Protection: Clean strings from dangerous characters
    const cleanName = name.replace(/<[^>]*>/g, '');
    const cleanSubject = subject.replace(/<[^>]*>/g, '');
    const cleanMessage = message.replace(/<[^>]*>/g, '');

    const contact = await prisma.contactMessage.create({
      data: {
        name: cleanName,
        email,
        subject: cleanSubject,
        message: cleanMessage,
      },
    });

    return NextResponse.json({ success: true, id: contact.id });
  } catch (error) {
    console.error('Contact submit error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
