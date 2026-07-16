// src/app/[lang]/projects/les-gardiens-du-quartier/page.tsx
import React from 'react';
import Link from 'next/link';
import { getDictionary } from '@/lib/get-dictionary';
import { prisma } from '@/lib/db';
import { GridPattern, OrganicBlob, GeometricDivider, AfricanBorderPattern } from '@/components/brand/PatternBackground';
import { Shield, Sparkles, Download, ArrowRight, Play, BookOpen, Compass, Heart, HelpCircle } from 'lucide-react';

interface ProjectPageProps {
  params: Promise<{ lang: string }>;
}

export default async function GardiensProjectPage({ params }: ProjectPageProps) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'fr';
  const dict = await getDictionary(lang);

  // Fetch project downloads from database
  const downloads = await prisma.download.findMany();

  const characterList = [
    {
      name: 'Ahmad',
      age: '13 ' + (lang === 'fr' ? 'ans' : 'y/o'),
      role: lang === 'fr' ? 'Curieux / Débrouillard' : 'Curious / Resourceful',
      desc: lang === 'fr'
        ? "Ahmad est un enfant plein d'énergie qui pose les bonnes questions et veut comprendre ce qui se passe derrière les écrans. Il apprend à reconnaître les dangers numériques avec courage et détermination."
        : "Ahmad is a lively child who asks the right questions and wants to understand what happens behind screens. He learns to spot digital dangers with courage and determination.",
      skill: lang === 'fr' ? 'Observation, Curiosité, Esprit d\'initiative' : 'Observation, Curiosity, Initiative',
      color: 'border-terracotta text-terracotta',
      avatar: '/main-characters/Ahmad.jpg',
    },
    {
      name: 'Sarah',
      age: '14 ' + (lang === 'fr' ? 'ans' : 'y/o'),
      role: lang === 'fr' ? 'Analytique / Observatrice' : 'Analytical / Observant',
      desc: lang === 'fr'
        ? "Sarah est attentive, réfléchie et très attachée à la vérité. Elle aide le groupe à décoder les signes d'alerte, à vérifier l'information et à protéger sa vie numérique."
        : "Sarah is attentive, thoughtful, and deeply attached to the truth. She helps the group decode warning signs, verify information, and protect their digital lives.",
      skill: lang === 'fr' ? 'Analyse, Vérification, Sens critique' : 'Analysis, Verification, Critical Thinking',
      color: 'border-deep-green text-deep-green',
      avatar: '/main-characters/Sarah.jpg',
    },
    {
      name: 'Ily',
      age: '13 ' + (lang === 'fr' ? 'ans' : 'y/o'),
      role: lang === 'fr' ? 'Calme / Méthodique' : 'Calm / Methodical',
      desc: lang === 'fr'
        ? "Ily est le cœur tranquille du groupe. Il écoute, observe et construit des réponses claires face aux mystères du web, surtout quand il s'agit de sécurité et de confidentialité."
        : "Ily is the calm center of the group. He listens, observes, and builds clear answers to the mysteries of the web, especially when security and privacy are involved.",
      skill: lang === 'fr' ? 'Patience, Organisation, Sens de la logique' : 'Patience, Organization, Logic',
      color: 'border-gold text-gold',
      avatar: '/main-characters/Ily.jpg',
    },
    {
      name: 'Yusuf',
      age: '12 ' + (lang === 'fr' ? 'ans' : 'y/o'),
      role: lang === 'fr' ? 'Énergique / Connecté au quartier' : 'Energetic / Connected to the neighborhood',
      desc: lang === 'fr'
        ? "Yusuf aime apprendre vite et partager ce qu'il découvre. Son énergie et sa curiosité l'aident à relier les expériences du quartier aux enjeux du numérique."
        : "Yusuf likes to learn quickly and share what he discovers. His energy and curiosity help him connect neighborhood experiences to digital issues.",
      skill: lang === 'fr' ? 'Communication, Échange, Sens pratique' : 'Communication, Exchange, Practical Sense',
      color: 'border-terracotta text-terracotta',
      avatar: '/main-characters/Yusuf.jpg',
    },
    {
      name: 'Junior',
      age: '11 ' + (lang === 'fr' ? 'ans' : 'y/o'),
      role: lang === 'fr' ? 'Créatif / Curieux' : 'Creative / Curious',
      desc: lang === 'fr'
        ? "Junior porte un regard neuf sur le monde. Il fait beaucoup de questions, invente des solutions simples et rappelle que l'apprentissage peut rester joyeux."
        : "Junior brings a fresh perspective to the world. He asks many questions, invents simple solutions, and reminds everyone that learning can stay joyful.",
      skill: lang === 'fr' ? 'Créativité, Questionnement, Imagination' : 'Creativity, Questioning, Imagination',
      color: 'border-deep-green text-deep-green',
      avatar: '/main-characters/Junior.jpg',
    },
    {
      name: 'Inspectrice Fatima',
      age: '35 ' + (lang === 'fr' ? 'ans' : 'y/o'),
      role: lang === 'fr' ? 'Mentor / Gardienne de la sécurité' : 'Mentor / Guardian of safety',
      desc: lang === 'fr'
        ? "L'Inspectrice Fatima guide le groupe avec calme et autorité. Elle transmet les valeurs de protection, de responsabilité et de confiance au service du quartier."
        : "Inspectrice Fatima guides the group with calm authority. She shares values of protection, responsibility, and trust in service of the neighborhood.",
      skill: lang === 'fr' ? 'Conseil, Encadrement, Sécurité' : 'Guidance, Mentorship, Safety',
      color: 'border-gold text-gold',
      avatar: '/main-characters/Inpectrice Famille.jpg',
    }
  ];

  const seasons = [
    {
      number: '01',
      title: lang === 'fr' ? 'Saison 1 : Découvrir les dangers' : 'Season 1: Discovering the dangers',
      focus: lang === 'fr' ? 'Identifier les risques du numérique' : 'Identifying digital risks',
      desc: lang === 'fr'
        ? "Ahmad, Sarah, Ily, Yusuf et Junior découvrent que le quartier est traversé par des messages trompeurs, des rumeurs en ligne et des situations dangereuses. Sous l'encadrement de l'Inspectrice Fatima, ils apprennent à se protéger."
        : "Ahmad, Sarah, Ily, Yusuf, and Junior discover that the neighborhood is being crossed by deceptive messages, online rumors, and dangerous situations. With the guidance of Inspectrice Fatima, they learn how to protect themselves."
    },
    {
      number: '02',
      title: lang === 'fr' ? 'Saison 2 : Comprendre le monde numérique' : 'Season 2: Understanding the digital world',
      focus: lang === 'fr' ? 'Les mécanismes du web et de l\'information' : 'How the web and information work',
      desc: lang === 'fr'
        ? "Le groupe apprend à mieux comprendre les algorithmes, les fausses informations et les outils numériques qui façonnent leur quotidien. Ils deviennent plus lucides, plus critiques et plus solidaires."
        : "The group learns to better understand algorithms, fake information, and digital tools that shape everyday life. They become more lucid, more critical, and more supportive.",
    },
    {
      number: '03',
      title: lang === 'fr' ? 'Saison 3 : Devenir un modèle' : 'Season 3: Becoming a role model',
      focus: lang === 'fr' ? 'Protège, informe et accompagne' : 'Protect, inform, and guide',
      desc: lang === 'fr'
        ? "Les héros passent de l'apprentissage à l'engagement. Ils deviennent des relais de confiance pour leurs familles, leurs amis et leur quartier, en partageant les bonnes pratiques de cybersécurité et de citoyenneté numérique."
        : "The heroes move from learning to action. They become trusted guides for their families, friends, and neighborhood by sharing good cybersecurity and digital citizenship practices."
    }
  ];

  const faq = lang === 'fr'
    ? [
        { q: "Quel est l'âge cible du projet ?", a: "Le projet s'adresse principalement aux enfants de 8 à 15 ans, ainsi qu'aux enseignants et parents pour les accompagner." },
        { q: "Comment les kits pédagogiques s'utilisent-ils ?", a: "Ils contiennent des fiches de cours claires, des exercices pratiques sur papier, et des jeux de rôle pour faire comprendre les risques informatiques sans écran." },
        { q: "Comment puis-je intégrer le projet dans mon école ?", a: "Téléchargez notre kit d'introduction, et contactez-nous via notre formulaire de contact afin de planifier une intervention." }
      ]
    : [
        { q: "What is the target age group?", a: "The project primarily targets children aged 8 to 15, as well as teachers and parents supporting their digital journey." },
        { q: "How are the educational kits used?", a: "They contain clear lesson sheets, practical paper exercises, and role-playing games to teach cybersecurity without screens." },
        { q: "How can I bring this project to my school?", a: "Download our intro kit, and get in touch with us using the contact form to schedule a workshop." }
      ];

  return (
    <div className="relative overflow-hidden min-h-screen">
      <GridPattern />
      <OrganicBlob color="terracotta" className="top-10 -right-20 opacity-30" />
      <OrganicBlob color="green" className="bottom-20 -left-20 opacity-20" />

      {/* DEDICATED HERO */}
      <section className="relative pt-12 pb-20 md:py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-deep-green/10 dark:bg-gold/10 border border-deep-green/20 text-xs font-bold text-deep-green dark:text-gold w-fit">
            <Shield className="w-3.5 h-3.5" />
            {lang === 'fr' ? 'Sensibilisation Numérique' : 'Digital Awareness'}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-deep-green dark:text-off-white leading-tight">
            Les Gardiens du Quartier
          </h1>
          
          <p className="text-base md:text-lg text-deep-green/80 dark:text-off-white/80 font-medium max-w-2xl leading-relaxed">
            {dict.gardiens.intro}
          </p>

          <div className="flex gap-4 mt-2">
            <Link
              href={`/${lang}/contact`}
              className="px-6 py-3 rounded-xl bg-terracotta text-white hover:bg-terracotta-light font-bold text-sm shadow-md transition-colors"
            >
              {dict.gardiens.cta}
            </Link>
            <a
              href="#kits"
              className="px-6 py-3 rounded-xl glass border border-[var(--color-border)] hover:bg-deep-green/5 dark:hover:bg-off-white/5 font-bold text-sm transition-colors"
            >
              {lang === 'fr' ? 'Télécharger les Kits' : 'Download Kits'}
            </a>
          </div>
        </div>
      </section>

      {/* TRAILER MOCKUP */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-[var(--color-border)] group">
          <img
            src="/assets/projects/gardiens-charachters.jpg"
            alt="Les Gardiens du Quartier banner"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-deep-green/30 mix-blend-overlay"></div>
          {/* Custom animated play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-20 h-20 rounded-full bg-gradient-terracotta-gold text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer">
              <Play className="w-8 h-8 fill-current text-white ml-1.5 animate-pulse" />
            </button>
          </div>
        </div>
      </section>

      {/* CORE VISION & OBJECTIVES */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl glass border border-[var(--color-border)] flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-deep-green dark:text-off-white">
              {lang === 'fr' ? 'La Vision Artistique' : 'The Artistic Vision'}
            </h3>
            <p className="text-xs leading-relaxed text-deep-green/75 dark:text-off-white/75 font-semibold">
              {lang === 'fr'
                ? "Créer un divertissement haut de gamme avec des décors et paysages authentiques d'Afrique subsaharienne pour que nos enfants s'identifient instantanément."
                : "Create high-end entertainment featuring authentic Sub-Saharan African landscapes so our kids instantly feel represented."}
            </p>
          </div>

          <div className="p-6 rounded-2xl glass border border-[var(--color-border)] flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-deep-green dark:text-off-white">
              {lang === 'fr' ? 'L\'Objectif Sécurité' : 'The Safety Objective'}
            </h3>
            <p className="text-xs leading-relaxed text-deep-green/75 dark:text-off-white/75 font-semibold">
              {lang === 'fr'
                ? "Sensibiliser de façon proactive aux risques de cyberharcèlement, usurpation d'identité et phishing à travers des aventures scénarisées."
                : "Proactively raise awareness on cyberbullying, identity theft, and phishing threats through carefully scripted adventure episodes."}
            </p>
          </div>

          <div className="p-6 rounded-2xl glass border border-[var(--color-border)] flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-deep-green dark:text-off-white">
              {lang === 'fr' ? 'Bénéfices Sociétaux' : 'Societal Benefits'}
            </h3>
            <p className="text-xs leading-relaxed text-deep-green/75 dark:text-off-white/75 font-semibold">
              {lang === 'fr'
                ? "Faire grandir une culture de protection et de confiance numérique dans les familles, les écoles et les quartiers à travers des histoires accessibles et porteuses d'espoir."
                : "Grow a culture of digital protection and trust in families, schools, and neighborhoods through stories that are accessible and full of hope."}
            </p>
          </div>
        </div>
      </section>

      {/* CHARACTERS SHOWCASE */}
      <section className="py-20 px-6 bg-deep-green/5 dark:bg-charcoal-light/20 border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs uppercase tracking-widest font-extrabold text-terracotta">
            {lang === 'fr' ? 'Les Protagonistes' : 'The Protagonists'}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-deep-green dark:text-off-white mt-2 mb-16">
            {dict.gardiens.characters}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {characterList.map((char, index) => (
              <div
                key={index}
                className="rounded-2xl overflow-hidden glass border border-[var(--color-border)] flex flex-col glow-card h-full"
              >
                <div className="aspect-[4/3] relative w-full bg-deep-green/10">
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-green/40 to-transparent" />
                  {/* Subtle character badge */}
                  <div className="absolute bottom-4 left-4 px-2.5 py-1 rounded-md bg-white text-deep-green text-[10px] font-bold uppercase tracking-wider shadow">
                    {char.age}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-deep-green dark:text-off-white">
                      {char.name}
                    </h3>
                    <span className="text-xs text-terracotta dark:text-gold font-bold block mb-2">
                      {char.role}
                    </span>
                    <p className="text-xs leading-relaxed text-deep-green/70 dark:text-off-white/70 font-semibold">
                      {char.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[var(--color-border)]/50 text-[10px]">
                    <span className="font-bold uppercase tracking-wider block text-deep-green/55 dark:text-off-white/50 mb-0.5">
                      {lang === 'fr' ? 'Compétences clés :' : 'Core Skills:'}
                    </span>
                    <span className="font-extrabold text-deep-green dark:text-gold uppercase tracking-wider">
                      {char.skill}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE THREE SEASONS TIMELINE */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-extrabold text-gold">
            Timeline
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-deep-green dark:text-off-white mt-2 mb-4">
            {dict.gardiens.timelineTitle}
          </h2>
          <p className="text-sm md:text-base text-deep-green/70 dark:text-off-white/70 max-w-xl mx-auto font-semibold">
            {dict.gardiens.timelineSubtitle}
          </p>
        </div>

        <div className="relative flex flex-col gap-12 md:gap-0">
          {/* Vertial/Horizontal line in background (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-[var(--color-border)] -translate-x-1/2 -z-10"></div>

          {seasons.map((season, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 md:items-center">
                {/* Text block left */}
                <div className={`md:col-span-5 flex ${isEven ? 'md:justify-end md:text-right' : 'md:order-last md:justify-start md:text-left'}`}>
                  <div className="p-6 rounded-2xl glass border border-[var(--color-border)] shadow-sm max-w-sm">
                    <span className="text-xs text-terracotta dark:text-gold font-bold block mb-1 uppercase tracking-wider">
                      {season.focus}
                    </span>
                    <h3 className="font-display font-bold text-base text-deep-green dark:text-off-white mb-2">
                      {season.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-deep-green/70 dark:text-off-white/70 font-semibold">
                      {season.desc}
                    </p>
                  </div>
                </div>

                {/* Central Badge */}
                <div className="hidden md:col-span-2 md:flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-terracotta-gold text-white font-display font-extrabold text-lg flex items-center justify-center shadow border-4 border-off-white dark:border-charcoal">
                    {season.number}
                  </div>
                </div>

                {/* Empty block to align */}
                <div className="hidden md:col-span-5 md:block"></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DOWNLOADS & KITS */}
      <section id="kits" className="py-20 px-6 bg-deep-green/5 dark:bg-charcoal-light/10 border-t border-[var(--color-border)] scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest font-extrabold text-terracotta">
              Resources
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-deep-green dark:text-off-white mt-2 mb-4">
              {dict.gardiens.kits}
            </h2>
            <p className="text-sm md:text-base text-deep-green/70 dark:text-off-white/70 max-w-xl mx-auto font-semibold">
              {dict.gardiens.kitsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {downloads.map((dl) => (
              <div
                key={dl.id}
                className="p-6 rounded-2xl glass border border-[var(--color-border)] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 glow-card"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta shrink-0 border border-terracotta/20">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-deep-green dark:text-off-white leading-snug">
                      {dl.name}
                    </h3>
                    <p className="text-xs text-deep-green/75 dark:text-off-white/70 mt-1 font-semibold leading-relaxed">
                      {dl.description}
                    </p>
                    <div className="flex gap-4 mt-2.5 text-[10px] font-bold text-deep-green/50 dark:text-off-white/50 uppercase tracking-wider">
                      <span>File Size: {dl.fileSize}</span>
                      <span>Downloads: {dl.downloadCount}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`/api/download?id=${dl.id}`}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-deep-green text-off-white dark:bg-terracotta hover:bg-deep-green-light dark:hover:bg-terracotta-light font-bold text-xs shrink-0 cursor-pointer shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  {lang === 'fr' ? 'Télécharger' : 'Download'}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TARGETED INSTITUTIONAL PARTNERS */}
      <section className="py-16 px-6 max-w-7xl mx-auto text-center border-t border-[var(--color-border)]">
        <h3 className="text-xs uppercase tracking-widest font-extrabold text-deep-green/60 dark:text-off-white/60 mb-6">
          {lang === 'fr' ? 'Partenariats Éducatifs En Cible' : 'Targeted Educational Partnerships'}
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-6 opacity-60">
          <span className="px-4 py-1.5 rounded-lg border border-[var(--color-border)] font-bold text-xs uppercase">UNICEF</span>
          <span className="px-4 py-1.5 rounded-lg border border-[var(--color-border)] font-bold text-xs uppercase">MINEDUB</span>
          <span className="px-4 py-1.5 rounded-lg border border-[var(--color-border)] font-bold text-xs uppercase">MINESEC</span>
          <span className="px-4 py-1.5 rounded-lg border border-[var(--color-border)] font-bold text-xs uppercase">MINJEC</span>
        </div>
        <p className="text-[10px] uppercase font-bold text-terracotta tracking-widest mt-6">
          ⚠️ {lang === 'fr' ? 'Partenariats en cours de structuration' : 'Partnerships currently under structuring'}
        </p>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="py-20 px-6 bg-deep-green/5 dark:bg-charcoal-light/10 border-t border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 flex flex-col items-center gap-2">
            <HelpCircle className="w-8 h-8 text-terracotta" />
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-deep-green dark:text-off-white">
              Questions Fréquentes
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {faq.map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl glass border border-[var(--color-border)] shadow-sm"
              >
                <h3 className="font-display font-bold text-sm text-deep-green dark:text-gold mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0"></span>
                  {item.q}
                </h3>
                <p className="text-xs leading-relaxed text-deep-green/75 dark:text-off-white/70 font-semibold pl-3.5">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GeometricDivider />
    </div>
  );
}
