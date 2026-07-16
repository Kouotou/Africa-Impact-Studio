// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { getAssistantReply } from '@/lib/le-gardien-knowledge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = typeof body.message === 'string' ? body.message : '';
    const lang = body.lang === 'en' ? 'en' : 'fr';

    const reply = getAssistantReply(message, lang);

    await new Promise((resolve) => setTimeout(resolve, 600));

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
