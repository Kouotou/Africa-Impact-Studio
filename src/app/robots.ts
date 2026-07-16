// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/*/admin', '/api'], // Disallow crawling admin dashboards and API endpoints
    },
    sitemap: 'https://africaimpact.studio/sitemap.xml',
  };
}
