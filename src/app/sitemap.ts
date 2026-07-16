// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://africaimpact.studio';

  // Fetch blog posts for dynamic sitemap inclusion
  const posts = await prisma.blogPost.findMany({ where: { published: true } });
  const postUrls = posts.flatMap((post) => [
    {
      url: `${baseUrl}/fr/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
    },
    {
      url: `${baseUrl}/en/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
    }
  ]);

  const staticPaths = [
    '',
    '/fr',
    '/en',
    '/fr/projects/les-gardiens-du-quartier',
    '/en/projects/les-gardiens-du-quartier',
    '/fr/blog',
    '/en/blog',
    '/fr/resources',
    '/en/resources',
    '/fr/contact',
    '/en/contact',
  ];

  const staticUrls = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  return [...staticUrls, ...postUrls];
}
