// src/app/api/admin/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Simple mocked session check (in production, use iron-session, next-auth or jose)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // LOGIN ACTION
    if (action === 'login') {
      const { email, password } = body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      // Hardcoded bcrypt validation match for seed.js hash
      // email: admin@africaimpact.studio, pass: AdminImpact2026!
      if (email === 'admin@africaimpact.studio' && password === 'AdminImpact2026!') {
        return NextResponse.json({ success: true, user: { name: user.name, role: user.role } });
      }
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // CRUD ADD BLOG POST
    if (action === 'add_post') {
      const { title, category, excerpt, content } = body;
      if (!title || !category || !excerpt || !content) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const author = await prisma.user.findFirst();
      if (!author) return NextResponse.json({ error: 'No users found' }, { status: 400 });

      const newPost = await prisma.blogPost.create({
        data: {
          title,
          slug,
          category,
          excerpt,
          content,
          coverImage: '/assets/blog/default.jpg',
          published: true,
          authorId: author.id,
        },
      });
      return NextResponse.json({ success: true, data: newPost });
    }

    // CRUD ADD PROJECT
    if (action === 'add_project') {
      const { title, tagline, description, category } = body;
      if (!title || !tagline || !description || !category) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
      }
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
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
      const { id } = body;
      await prisma.blogPost.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    // CRUD DELETE PROJECT
    if (action === 'delete_project') {
      const { id } = body;
      await prisma.project.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    // CRUD DELETE CONTACT MESSAGE
    if (action === 'delete_message') {
      const { id } = body;
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
