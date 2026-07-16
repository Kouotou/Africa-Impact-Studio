// src/app/[lang]/resources/page.tsx
import React from 'react';
import { getDictionary } from '@/lib/get-dictionary';
import { prisma } from '@/lib/db';
import { GridPattern, OrganicBlob, GeometricDivider } from '@/components/brand/PatternBackground';
import { Download, BookOpen, FileText, FileSpreadsheet } from 'lucide-react';

interface ResourcesProps {
  params: Promise<{ lang: string }>;
}

export default async function ResourcesPage({ params }: ResourcesProps) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'fr';
  const dict = await getDictionary(lang);

  const downloads = await prisma.download.findMany({
    orderBy: { name: 'asc' },
  });

  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('bible')) return BookOpen;
    if (lower.includes('kit') || lower.includes('pédagogique')) return FileSpreadsheet;
    return FileText;
  };

  return (
    <div className="relative overflow-hidden min-h-screen py-16 px-6">
      <GridPattern />
      <OrganicBlob color="terracotta" className="top-10 -left-20 opacity-30" />
      <OrganicBlob color="gold" className="bottom-20 -right-20 opacity-20" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest font-extrabold text-terracotta">
            {lang === 'fr' ? 'Centre de Téléchargement' : 'Download Center'}
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-deep-green dark:text-off-white">
            {lang === 'fr' ? 'Ressources & Documents' : 'Resources & Documents'}
          </h1>
          <p className="text-sm md:text-base text-deep-green/70 dark:text-off-white/70 font-semibold leading-relaxed">
            {lang === 'fr'
              ? 'Accédez à nos kits scolaires, bibles de production, documents de presse et one-pagers de présentation.'
              : 'Access our school kits, production bibles, press documents, and presentation one-pagers.'}
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {downloads.map((dl) => {
            const Icon = getIcon(dl.name);
            return (
              <div
                key={dl.id}
                className="p-6 rounded-2xl glass border border-[var(--color-border)] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 glow-card"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta shrink-0 border border-terracotta/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-deep-green dark:text-off-white leading-snug">
                      {dl.name}
                    </h3>
                    <p className="text-xs text-deep-green/75 dark:text-off-white/70 mt-1 font-semibold leading-relaxed">
                      {dl.description}
                    </p>
                    <div className="flex gap-4 mt-2.5 text-[10px] font-bold text-deep-green/50 dark:text-off-white/50 uppercase tracking-wider">
                      <span>{lang === 'fr' ? 'Taille :' : 'Size :'} {dl.fileSize}</span>
                      <span>{lang === 'fr' ? 'Téléchargements :' : 'Downloads :'} {dl.downloadCount}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`/api/download?id=${dl.id}`}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-deep-green text-off-white dark:bg-terracotta hover:bg-deep-green-light dark:hover:bg-terracotta-light font-bold text-xs shrink-0 cursor-pointer shadow transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  {lang === 'fr' ? 'Télécharger' : 'Download'}
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-20">
          <GeometricDivider />
        </div>
      </div>
    </div>
  );
}
