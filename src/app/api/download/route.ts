// src/app/api/download/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing file ID' }, { status: 400 });
  }

  try {
    const download = await prisma.download.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });

    // Create a plain text file simulation of the PDF/ZIP resource
    const mockFileContent = `=====================================================
            AFRICA IMPACT STUDIO (AIS)
=====================================================
DOCUMENT TYPE : EDUCATIONAL / INSTITUTIONAL RESOURCE
RESOURCE NAME : ${download.name}
DESCRIPTION   : ${download.description}
FILE SIZE     : ${download.fileSize}
TIMESTAMP     : ${new Date().toUTCString()}
STATUS        : CONFIDENTIAL / PARTNER ACCESS
=====================================================
Thank you for downloading our resource. For inquiries:
contact@africaimpact.studio | Yaoundé, Cameroun.`;

    const sanitizedFilename = download.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9]+/g, '-');   // replace special chars with dashes

    return new Response(mockFileContent, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${sanitizedFilename}.txt"`,
      },
    });
  } catch (error) {
    console.error('Download API error:', error);
    return NextResponse.json({ error: 'File resource not found' }, { status: 404 });
  }
}
