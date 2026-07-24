// src/app/[lang]/blog/page.tsx
import React from 'react';
import Link from 'next/link';
import { getDictionary } from '@/lib/get-dictionary';
import { prisma } from '@/lib/db';
import { GridPattern, OrganicBlob } from '@/components/brand/PatternBackground';
import { ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';

interface BlogPageProps {
  params: Promise<{ lang: string }>;
}

export default async function BlogListingPage({ params }: BlogPageProps) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'fr';
  const dict = await getDictionary(lang);

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="relative overflow-hidden min-h-screen py-16 px-6">
      <GridPattern />
      <OrganicBlob color="green" className="top-10 -left-20 opacity-30" />
      <OrganicBlob color="terracotta" className="bottom-20 -right-20 opacity-20" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest font-extrabold text-terracotta">
            Blog Editorial
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-deep-green dark:text-off-white">
            {lang === 'fr' ? 'Nos Écrits & Analyses' : 'Our Writings & Analyses'}
          </h1>
          <p className="text-sm md:text-base text-deep-green/70 dark:text-off-white/70 font-semibold leading-relaxed">
            {lang === 'fr'
              ? 'Réflexions sur l\'intelligence artificielle, la cybersécurité junior, le storytelling et le futur de l\'éducation numérique en Afrique.'
              : 'Thoughts on artificial intelligence, junior cybersecurity, storytelling, and the future of digital education in Africa.'}
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col rounded-2xl overflow-hidden glass border border-[var(--color-border)] shadow-sm glow-card h-full"
            >
              <div className="aspect-video w-full relative bg-deep-green/10 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-terracotta-gold opacity-10" />
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-deep-green text-white dark:bg-terracotta text-[10px] font-bold uppercase tracking-wider">
                  {post.category}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow gap-3 justify-between">
                <div>
                  <div className="flex items-center gap-4 text-[10px] font-semibold opacity-60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(post.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}
                    </span>
                    <span className="flex items-center gap-1 uppercase tracking-wide">
                      <Tag className="w-3 h-3 text-terracotta" />
                      {post.category}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-deep-green dark:text-off-white leading-snug line-clamp-2 mt-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-deep-green/70 dark:text-off-white/70 line-clamp-3 leading-relaxed mt-2 font-medium">
                    {post.excerpt}
                  </p>
                </div>
                <Link
                  href={`/${lang}/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta dark:text-gold hover:underline mt-4 cursor-pointer"
                >
                  {lang === 'fr' ? 'Lire l\'article complet' : 'Read full article'} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
