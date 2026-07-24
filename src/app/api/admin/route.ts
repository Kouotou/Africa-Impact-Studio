// src/app/api/admin/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { mkdir, unlink, writeFile } from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { createSessionToken, verifySessionToken, SESSION_COOKIE, SESSION_TTL_MS } from '@/lib/session';

const BLOG_UPLOAD_DIR = path.join(process.cwd(), 'public', 'assets', 'blog');
const DEFAULT_COVER_IMAGE = '/assets/blog/default.svg';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

async function getSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

// Every action except login/logout requires a valid, unexpired session cookie.
async function requireSession() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return null;
  return session;
}

async function saveBlogImage(file: File, slugHint: string): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES[file.type]) {
    throw new Error('Unsupported image type. Use JPEG, PNG, WEBP or GIF.');
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Image too large (max 5MB).');
  }
  await mkdir(BLOG_UPLOAD_DIR, { recursive: true });
  const ext = ALLOWED_IMAGE_TYPES[file.type];
  const safeSlug = slugHint.replace(/[^a-z0-9-]/g, '') || 'post';
  const filename = `${safeSlug}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(BLOG_UPLOAD_DIR, filename), buffer);
  return `/assets/blog/${filename}`;
}

// Best-effort cleanup — never blocks the request if the file is already gone.
async function deleteBlogImageIfOwned(coverImage: string | null | undefined) {
  if (!coverImage || coverImage === DEFAULT_COVER_IMAGE || !coverImage.startsWith('/assets/blog/')) return;
  try {
    await unlink(path.join(process.cwd(), 'public', coverImage));
  } catch {
    // ignore
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let action = '';
    const fields: Record<string, string> = {};
    let imageFile: File | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        if (key === 'image' && value instanceof File) {
          if (value.size > 0) imageFile = value;
        } else if (typeof value === 'string') {
          if (key === 'action') action = value;
          else fields[key] = value;
        }
      }
    } else {
      const body = await request.json();
      action = body.action || '';
      for (const [key, value] of Object.entries(body)) {
        if (key !== 'action' && typeof value === 'string') fields[key] = value;
      }
    }

    // LOGIN ACTION
    if (action === 'login') {
      const { email, password } = fields;
      const user = email ? await prisma.user.findUnique({ where: { email } }) : null;

      // Always run bcrypt.compare, even without a matching user, so login
      // timing doesn't reveal whether an email exists in the database.
      const passwordHash = user?.passwordHash || '$2b$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva';
      const passwordMatches = await bcrypt.compare(password || '', passwordHash);

      if (!user || user.role !== 'ADMIN' || !passwordMatches) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      const token = createSessionToken(user.id, user.role);
      const store = await cookies();
      store.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_TTL_MS / 1000,
        path: '/',
      });
      return NextResponse.json({ success: true, user: { name: user.name, role: user.role } });
    }

    // LOGOUT ACTION
    if (action === 'logout') {
      const store = await cookies();
      store.delete(SESSION_COOKIE);
      return NextResponse.json({ success: true });
    }

    // Every action below is a protected admin operation.
    const session = await requireSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // CRUD ADD BLOG POST
    if (action === 'add_post') {
      const { title, category, excerpt, content } = fields;
      if (!title || !category || !excerpt || !content) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      let coverImage = DEFAULT_COVER_IMAGE;
      if (imageFile) {
        try {
          coverImage = await saveBlogImage(imageFile, slug);
        } catch (e) {
          return NextResponse.json({ error: (e as Error).message }, { status: 400 });
        }
      }

      const newPost = await prisma.blogPost.create({
        data: {
          title,
          slug,
          category,
          excerpt,
          content,
          coverImage,
          published: true,
          authorId: session.uid,
        },
      });
      return NextResponse.json({ success: true, data: newPost });
    }

    // CRUD UPDATE BLOG POST
    if (action === 'update_post') {
      const { id, title, category, excerpt, content } = fields;
      if (!id || !title || !category || !excerpt || !content) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }
      const existing = await prisma.blogPost.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      let coverImage = existing.coverImage;
      if (imageFile) {
        try {
          coverImage = await saveBlogImage(imageFile, existing.slug);
        } catch (e) {
          return NextResponse.json({ error: (e as Error).message }, { status: 400 });
        }
        await deleteBlogImageIfOwned(existing.coverImage);
      }

      const updated = await prisma.blogPost.update({
        where: { id },
        data: { title, category, excerpt, content, coverImage },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    // CRUD ADD PROJECT
    if (action === 'add_project') {
      const { title, tagline, description, category } = fields;
      if (!title || !tagline || !description || !category) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newProj = await prisma.project.create({
        data: {
          title,
          slug,
          tagline,
          description,
          category,
          status: 'Active',
          coverImage: '/assets/projects/default.jpg',
          images: '',
          isFlagship: false,
        },
      });
      return NextResponse.json({ success: true, data: newProj });
    }

    // CRUD DELETE POST
    if (action === 'delete_post') {
      const { id } = fields;
      const existing = await prisma.blogPost.findUnique({ where: { id } });
      if (existing) await deleteBlogImageIfOwned(existing.coverImage);
      await prisma.blogPost.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    // CRUD DELETE PROJECT
    if (action === 'delete_project') {
      const { id } = fields;
      await prisma.project.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    // CRUD DELETE CONTACT MESSAGE
    if (action === 'delete_message') {
      const { id } = fields;
      await prisma.contactMessage.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Admin API Post error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// FETCH ALL RECORDS FOR DASHBOARD VIEW
export async function GET() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const blogPosts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    const partners = await prisma.partner.findMany();
    const downloads = await prisma.download.findMany();
    const contactMessages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });

    return NextResponse.json({
      blogPosts,
      projects,
      partners,
      downloads,
      contactMessages,
    });
  } catch (error) {
    console.error('Admin API Get error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
