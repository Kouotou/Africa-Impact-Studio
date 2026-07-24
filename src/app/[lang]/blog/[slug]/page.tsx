// src/app/[lang]/blog/[slug]/page.tsx
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { GridPattern, OrganicBlob, GeometricDivider } from '@/components/brand/PatternBackground';
import { ArrowLeft, Clock, Tag, User } from 'lucide-react';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { lang: rawLang, slug } = await params;
  const lang = rawLang === 'en' ? 'en' : 'fr';

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="relative overflow-hidden min-h-screen py-16 px-6">
      <GridPattern />
      <OrganicBlob color="terracotta" className="top-10 -right-20 opacity-30" />
      <OrganicBlob color="green" className="bottom-20 -left-20 opacity-20" />

      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb Back link */}
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-2 text-xs font-bold text-deep-green/60 dark:text-off-white/60 hover:text-terracotta transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'fr' ? 'Retour au blog' : 'Back to blog'}
        </Link>

        {/* Cover image */}
        <div className="aspect-video w-full relative rounded-2xl overflow-hidden bg-deep-green/10 mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Article Meta */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 text-xs font-bold text-terracotta dark:text-gold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/10 border border-terracotta/20">
              <Tag className="w-3.5 h-3.5" />
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 opacity-60">
              <Clock className="w-3.5 h-3.5" />
              {new Date(post.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-deep-green dark:text-off-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 py-4 border-y border-[var(--color-border)]/50 text-xs font-semibold text-deep-green/75 dark:text-off-white/70">
            <div className="w-8 h-8 rounded-full bg-gradient-terracotta-gold flex items-center justify-center text-white font-extrabold text-sm uppercase">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-deep-green dark:text-off-white">{post.author.name}</p>
              <p className="text-[10px] opacity-75">{lang === 'fr' ? 'Éditeur AIS' : 'AIS Editor'}</p>
            </div>
          </div>
        </div>

        {/* Content body */}
        <article className="mt-10 text-sm md:text-base leading-relaxed text-deep-green/80 dark:text-off-white/80 font-medium space-y-6">
          {/* Simple parser for paragraph breaks in seed.js content */}
          {post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-2xl font-display font-bold text-deep-green dark:text-gold pt-4">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-xl font-display font-bold text-deep-green dark:text-gold pt-2">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
              // list items
              return (
                <ul key={index} className="list-disc pl-6 space-y-2">
                  {paragraph.split('\n').map((li, i) => (
                    <li key={i}>{li.replace(/^(-|\d+\.)\s+/, '')}</li>
                  ))}
                </ul>
              );
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </article>

        <div className="mt-16">
          <GeometricDivider />
        </div>
      </div>
    </div>
  );
}
