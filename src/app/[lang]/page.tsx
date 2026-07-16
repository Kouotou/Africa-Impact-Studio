// src/app/[lang]/page.tsx
import React from 'react';
import Link from 'next/link';
import { getDictionary } from '@/lib/get-dictionary';
import { prisma } from '@/lib/db';
import { GridPattern, OrganicBlob, GeometricDivider, AfricanBorderPattern } from '@/components/brand/PatternBackground';
import StatCounter from '@/components/ui/StatCounter';
import TabSection from '@/components/ui/TabSection';
import { ShieldCheck, Play, ArrowRight, BookOpen, Film, Layers, Monitor, Shield, Award } from 'lucide-react';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'fr';
  const dict = await getDictionary(lang);

  // Fetch data from database
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const flagshipProject = projects.find((p) => p.isFlagship) || projects[0];
  const otherProjects = projects.filter((p) => !p.isFlagship);

  const partners = await prisma.partner.findMany({
    where: { status: 'IN_DEVELOPMENT' },
  });

  const latestPosts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  const domainIcons = {
    ai: Monitor,
    animation: Film,
    training: BookOpen,
    apps: Layers,
    cyber: Shield,
    production: Award,
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background visual helpers */}
      <GridPattern />
      <OrganicBlob color="terracotta" className="top-10 -left-20 opacity-30" />
      <OrganicBlob color="green" className="top-[40%] -right-20 opacity-20" />
      <OrganicBlob color="gold" className="bottom-10 left-[20%] opacity-20" />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-terracotta/10 border border-terracotta/20 text-xs font-bold text-terracotta w-fit animate-pulse">
              <span className="w-2 h-2 rounded-full bg-terracotta"></span>
              {dict.hero.highlightBadge}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-extrabold leading-tight text-deep-green dark:text-off-white">
              {dict.hero.slogan}
            </h1>
            
            <p className="text-base md:text-lg text-deep-green/80 dark:text-off-white/80 font-medium max-w-xl leading-relaxed">
              {dict.hero.subtitle}
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <a
                href="#projects"
                className="px-6 py-3.5 rounded-xl bg-terracotta text-white hover:bg-terracotta-light font-bold shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                {dict.hero.ctaProjects}
              </a>
              <Link
                href={`/${lang}/contact`}
                className="px-6 py-3.5 rounded-xl glass border border-[var(--color-border)] hover:bg-deep-green/5 dark:hover:bg-off-white/5 font-bold transition-all transform hover:-translate-y-0.5"
              >
                {dict.hero.ctaContact}
              </Link>
            </div>
          </div>

          {/* Graphic Mock */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            <div className="relative w-full max-w-[460px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-border)] glow-card">
              <img
                src="/assets/hero-home.jpg"
                alt="Africa Impact Studio digital training illustration"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-green/60 to-transparent"></div>
              {/* Float micro tag */}
              <div className="absolute bottom-4 left-4 right-4 p-4 glass rounded-2xl flex items-center justify-between text-deep-green dark:text-white">
                <div>
                  <h4 className="font-display font-bold text-xs">Africa Impact Studio</h4>
                  <p className="text-[10px] opacity-75 font-semibold">Cameroun &middot; Afrique</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/30">
                  <ShieldCheck className="w-4 h-4 text-gold" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AfricanBorderPattern />

      {/* QUI SOMMES-NOUS (ABOUT) SECTION */}
      <section id="about" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="text-xs uppercase tracking-widest font-extrabold text-terracotta">
              AIS VISION
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-deep-green dark:text-off-white">
              {dict.about.title}
            </h2>
            <p className="text-sm md:text-base text-deep-green/70 dark:text-off-white/70 leading-relaxed font-semibold">
              {lang === 'fr' 
                ? "Nous unissons technologie de pointe et récits authentiques pour libérer le potentiel créatif et scientifique de la jeunesse africaine."
                : "We unite cutting-edge technology and authentic narratives to unlock the creative and scientific potential of African youth."}
            </p>
            {/* Visual Kente divider */}
            <div className="w-16 h-1.5 rounded-full bg-gradient-terracotta-gold mt-2"></div>
          </div>

          <div className="lg:col-span-7 w-full">
            <TabSection dict={dict} />
          </div>
        </div>
      </section>

      {/* FLAGSHIP PROJECT SPOTLIGHT SECTION (Les Gardiens du Quartier) */}
      <section className="py-20 px-6 bg-deep-green/5 dark:bg-charcoal-light/30 border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-widest font-extrabold text-gold">
                {lang === 'fr' ? 'Notre Chef-d\'œuvre' : 'Our Masterpiece'}
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-deep-green dark:text-off-white">
                {lang === 'fr' ? 'Projet Phare : Les Gardiens du Quartier' : 'Flagship Project: Les Gardiens du Quartier'}
              </h2>
            </div>
            <Link
              href={`/${lang}/projects/les-gardiens-du-quartier`}
              className="inline-flex items-center gap-2 text-sm font-bold text-terracotta dark:text-gold hover:underline cursor-pointer group"
            >
              {lang === 'fr' ? 'Explorer la page dédiée' : 'Explore the dedicated page'}{' '}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Immersive Trailer Mock */}
            <div className="lg:col-span-6 relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-border)] group">
              <img
                src="/assets/projects/gardiens-characters.jpg"
                alt="Les Gardiens du Quartier Trailer Thumbnail"
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-deep-green/30 mix-blend-overlay"></div>
              {/* Circular play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Link
                  href={`/${lang}/projects/les-gardiens-du-quartier`}
                  className="w-16 h-16 rounded-full bg-gradient-terracotta-gold text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 cursor-pointer"
                >
                  <Play className="w-6 h-6 fill-current text-white ml-1" />
                </Link>
              </div>
              <div className="absolute bottom-4 left-4 p-3 glass rounded-xl text-xs font-semibold">
                🎬 {lang === 'fr' ? 'Voir le Trailer Littéraire' : 'View Literary Trailer'}
              </div>
            </div>

            {/* Project Details */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <h3 className="text-xl md:text-2xl font-bold text-deep-green dark:text-gold leading-snug">
                {dict.gardiens.tagline}
              </h3>
              <p className="text-sm md:text-base text-deep-green/80 dark:text-off-white/80 leading-relaxed font-semibold">
                {dict.gardiens.intro}
              </p>

              {/* Characters Highlight Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'Ahmad', label: lang === 'fr' ? 'Curiosité / Courage' : 'Curiosity / Courage' },
                  { name: 'Sarah', label: lang === 'fr' ? 'Analyse / Vérité' : 'Analysis / Truth' },
                  { name: 'Ily', label: lang === 'fr' ? 'Calme / Logique' : 'Calm / Logic' },
                  { name: 'Yusuf', label: lang === 'fr' ? 'Énergie / Quartier' : 'Energy / Neighborhood' },
                  { name: 'Junior', label: lang === 'fr' ? 'Créativité / Questions' : 'Creativity / Questions' },
                  { name: 'Inspectrice-Fatima', label: lang === 'fr' ? 'Guidage / Sécurité' : 'Guidance / Safety' }
                ].map((person) => (
                  <div key={person.name} className="p-3 rounded-xl border border-[var(--color-border)] bg-white/50 dark:bg-charcoal/50 text-center">
                    <h4 className="font-bold text-xs text-terracotta dark:text-gold mb-0.5">{person.name}</h4>
                    <p className="text-[10px] opacity-75">{person.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Link
                  href={`/${lang}/projects/les-gardiens-du-quartier`}
                  className="px-5 py-3 rounded-xl bg-deep-green text-off-white dark:bg-terracotta hover:bg-deep-green-light dark:hover:bg-terracotta-light font-bold text-sm shadow-md transition-colors"
                >
                  {lang === 'fr' ? 'Explorer Les Gardiens' : 'Explore The Guardians'}
                </Link>
                <Link
                  href={`/${lang}/contact`}
                  className="px-5 py-3 rounded-xl glass border border-[var(--color-border)] hover:bg-deep-green/5 dark:hover:bg-off-white/5 font-bold text-sm transition-colors"
                >
                  {dict.gardiens.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOTRE IMPACT SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <span className="text-xs uppercase tracking-widest font-extrabold text-terracotta">
          SOCIAL IMPACT
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-extrabold text-deep-green dark:text-off-white mt-2 mb-4">
          {dict.impact.title}
        </h2>
        <p className="text-sm md:text-base text-deep-green/70 dark:text-off-white/70 max-w-xl mx-auto mb-16 font-semibold">
          {dict.impact.subtitle}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center gap-2 p-6 rounded-2xl glass border border-[var(--color-border)] shadow-sm">
            <StatCounter end={50000} suffix="+" />
            <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-deep-green/70 dark:text-off-white/70">
              {dict.impact.stats.kids}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 p-6 rounded-2xl glass border border-[var(--color-border)] shadow-sm">
            <StatCounter end={120} suffix="+" />
            <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-deep-green/70 dark:text-off-white/70">
              {dict.impact.stats.schools}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 p-6 rounded-2xl glass border border-[var(--color-border)] shadow-sm">
            <StatCounter end={projects.length} />
            <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-deep-green/70 dark:text-off-white/70">
              {dict.impact.stats.projects}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 p-6 rounded-2xl glass border border-[var(--color-border)] shadow-sm">
            <StatCounter end={partners.length} />
            <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-deep-green/70 dark:text-off-white/70">
              {dict.impact.stats.partners}
            </span>
          </div>
        </div>
      </section>

      {/* EXPERTISE DOMAINS SECTION */}
      <section className="py-20 px-6 bg-deep-green/5 dark:bg-charcoal-light/10 border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs uppercase tracking-widest font-extrabold text-gold">
            {lang === 'fr' ? 'Nos Compétences' : 'Our Skills'}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-deep-green dark:text-off-white mt-2 mb-4">
            {dict.domains.title}
          </h2>
          <p className="text-sm md:text-base text-deep-green/70 dark:text-off-white/70 max-w-xl mx-auto mb-16 font-semibold">
            {dict.domains.subtitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {/* Card AI */}
            <div className="p-6 rounded-2xl glass border border-[var(--color-border)] glow-card flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta border border-terracotta/20">
                <Monitor className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-deep-green dark:text-off-white">
                {dict.domains.list.ai}
              </h3>
              <p className="text-xs leading-relaxed text-deep-green/70 dark:text-off-white/70 font-semibold">
                {dict.domains.list.aiDesc}
              </p>
            </div>

            {/* Card Animation */}
            <div className="p-6 rounded-2xl glass border border-[var(--color-border)] glow-card flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta border border-terracotta/20">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-deep-green dark:text-off-white">
                {dict.domains.list.animation}
              </h3>
              <p className="text-xs leading-relaxed text-deep-green/70 dark:text-off-white/70 font-semibold">
                {dict.domains.list.animationDesc}
              </p>
            </div>

            {/* Card Training */}
            <div className="p-6 rounded-2xl glass border border-[var(--color-border)] glow-card flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta border border-terracotta/20">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-deep-green dark:text-off-white">
                {dict.domains.list.training}
              </h3>
              <p className="text-xs leading-relaxed text-deep-green/70 dark:text-off-white/70 font-semibold">
                {dict.domains.list.trainingDesc}
              </p>
            </div>

            {/* Card Apps */}
            <div className="p-6 rounded-2xl glass border border-[var(--color-border)] glow-card flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta border border-terracotta/20">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-deep-green dark:text-off-white">
                {dict.domains.list.apps}
              </h3>
              <p className="text-xs leading-relaxed text-deep-green/70 dark:text-off-white/70 font-semibold">
                {dict.domains.list.appsDesc}
              </p>
            </div>

            {/* Card Cyber */}
            <div className="p-6 rounded-2xl glass border border-[var(--color-border)] glow-card flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta border border-terracotta/20">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-deep-green dark:text-off-white">
                {dict.domains.list.cyber}
              </h3>
              <p className="text-xs leading-relaxed text-deep-green/70 dark:text-off-white/70 font-semibold">
                {dict.domains.list.cyberDesc}
              </p>
            </div>

            {/* Card Audiovisual */}
            <div className="p-6 rounded-2xl glass border border-[var(--color-border)] glow-card flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta border border-terracotta/20">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-deep-green dark:text-off-white">
                {dict.domains.list.production}
              </h3>
              <p className="text-xs leading-relaxed text-deep-green/70 dark:text-off-white/70 font-semibold">
                {dict.domains.list.productionDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS LOGO TAPE SECTION */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-[var(--color-border)] text-center">
        <h3 className="text-xs uppercase tracking-widest font-extrabold text-deep-green/60 dark:text-off-white/60 mb-8">
          {dict.partners.title}
        </h3>
        
        <div className="flex flex-wrap items-center justify-center gap-10 opacity-60">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="px-4 py-2 rounded-lg bg-deep-green/5 dark:bg-white/5 text-sm font-extrabold tracking-wider text-deep-green dark:text-off-white"
              title={dict.partners.status}
            >
              {partner.name}
            </div>
          ))}
        </div>
        
        <p className="text-[10px] uppercase font-bold text-terracotta tracking-widest mt-6">
          ⚠️ {dict.partners.status}
        </p>
      </section>

      {/* LATEST BLOG POSTS SECTION */}
      <section className="py-20 px-6 bg-deep-green/5 dark:bg-charcoal-light/10 border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-widest font-extrabold text-terracotta">
                {lang === 'fr' ? 'Pensée & Actualités' : 'Thoughts & News'}
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-deep-green dark:text-off-white">
                {lang === 'fr' ? 'Publications du Blog' : 'Blog Publications'}
              </h2>
            </div>
            <Link
              href={`/${lang}/blog`}
              className="inline-flex items-center gap-2 text-sm font-bold text-terracotta dark:text-gold hover:underline cursor-pointer group"
            >
              {lang === 'fr' ? 'Consulter tous les articles' : 'Consult all articles'}{' '}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <article
                key={post.id}
                className="flex flex-col rounded-2xl overflow-hidden glass border border-[var(--color-border)] shadow-sm glow-card h-full"
              >
                <div className="aspect-video w-full relative bg-deep-green/10">
                  <div className="absolute inset-0 bg-gradient-terracotta-gold opacity-10" />
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-deep-green text-white dark:bg-terracotta text-[10px] font-bold uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow gap-3 justify-between">
                  <div>
                    <span className="text-[10px] font-semibold opacity-60">
                      {new Date(post.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US')}
                    </span>
                    <h3 className="font-display font-bold text-base text-deep-green dark:text-off-white leading-snug line-clamp-2 mt-1">
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
                    {lang === 'fr' ? 'Lire la suite' : 'Read more'} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <GeometricDivider />
    </div>
  );
}
