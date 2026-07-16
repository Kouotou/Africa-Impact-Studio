// src/components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  lang: 'fr' | 'en';
  dict: any;
}

export default function Footer({ lang, dict }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[var(--color-border)] bg-off-white dark:bg-charcoal pt-16 pb-12 transition-colors overflow-hidden">
      {/* Decorative background geometric blob */}
      <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-terracotta/5 blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute left-0 top-0 w-80 h-80 rounded-full bg-deep-green/5 blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Info */}
        <div className="flex flex-col gap-4">
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-terracotta-gold flex items-center justify-center p-1 shadow-md">
              <span className="text-white font-display font-extrabold text-sm">AIS</span>
            </div>
            <span className="font-display font-bold text-base leading-tight tracking-wide text-terracotta dark:text-gold">
              AFRICA IMPACT STUDIO
            </span>
          </Link>
          <p className="text-sm font-semibold text-deep-green/70 dark:text-off-white/70 italic">
            "{dict.hero.slogan}"
          </p>
          <div className="flex gap-4 mt-2">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-deep-green/5 dark:bg-off-white/5 hover:bg-terracotta/10 hover:text-terracotta transition-all text-deep-green dark:text-off-white" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-deep-green/5 dark:bg-off-white/5 hover:bg-terracotta/10 hover:text-terracotta transition-all text-deep-green dark:text-off-white" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="https://youtube.com/@LesGardiensDuQuartier" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-deep-green/5 dark:bg-off-white/5 hover:bg-terracotta/10 hover:text-terracotta transition-all text-deep-green dark:text-off-white" aria-label="YouTube">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163c-.272-1.022-1.074-1.826-2.099-2.099C19.544 3.5 12 3.5 12 3.5s-7.544 0-9.4.564c-1.025.273-1.827 1.077-2.1 2.099C0 8.02 0 12 0 12s0 3.98.5 5.837c.272 1.022 1.074 1.826 2.099 2.099C6.456 20.5 12 20.5 12 20.5s7.544 0 9.4-.564c1.025-.273 1.827-1.077 2.1-2.099.5-1.857.5-5.837.5-5.837s0-3.98-.5-5.837zm-14.168 9.4V8.44l6.47 3.56-6.47 3.56z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-deep-green dark:text-gold">
            Navigation
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link href={`/${lang}`} className="hover:text-terracotta transition-colors font-medium">
                {dict.nav.home}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}#about`} className="hover:text-terracotta transition-colors font-medium">
                {dict.nav.about}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}#projects`} className="hover:text-terracotta transition-colors font-medium">
                {dict.nav.projects}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/blog`} className="hover:text-terracotta transition-colors font-medium">
                {dict.nav.blog}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/resources`} className="hover:text-terracotta transition-colors font-medium">
                {dict.nav.resources}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-deep-green dark:text-gold">
            {dict.contact.details.title}
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-terracotta mt-0.5 shrink-0" />
              <span className="font-medium text-deep-green/80 dark:text-off-white/80">
                {dict.contact.details.address}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-terracotta shrink-0" />
              <span className="font-medium text-deep-green/80 dark:text-off-white/80">
                {dict.contact.details.phone}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-terracotta shrink-0" />
              <span className="font-medium text-deep-green/80 dark:text-off-white/80">
                {dict.contact.details.email}
              </span>
            </li>
          </ul>
        </div>

        {/* Newsletter / Partnership banner */}
        <div className="flex flex-col gap-4">
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-deep-green dark:text-gold">
            Newsletter
          </h3>
          <p className="text-xs text-deep-green/70 dark:text-off-white/70">
            {lang === 'fr' 
              ? 'Inscrivez-vous pour recevoir nos dernières actualités sur nos projets éducatifs.' 
              : 'Subscribe to receive our latest updates regarding our educational projects.'}
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email"
              className="px-3 py-2 rounded-lg text-xs bg-white dark:bg-charcoal-light border border-[var(--color-border)] focus:outline-none focus:border-terracotta w-full"
            />
            <button className="px-3 py-2 rounded-lg bg-terracotta text-white font-bold text-xs hover:bg-terracotta-light transition-colors">
              Ok
            </button>
          </div>
          <div className="mt-2 p-2.5 rounded-lg border border-gold/25 bg-gold/5 text-[10px] leading-relaxed text-deep-green dark:text-gold font-semibold uppercase tracking-wider">
            ⚠️ {dict.partners.status}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-[var(--color-border)]/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-deep-green/60 dark:text-off-white/60">
        <span>
          &copy; {currentYear} Africa Impact Studio. All rights reserved.
        </span>
        <div className="flex gap-6">
          <Link href={`/${lang}/admin`} className="hover:text-terracotta flex items-center gap-1">
            {dict.nav.admin} Panel <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <a href="#" className="hover:text-terracotta">Privacy Policy</a>
          <a href="#" className="hover:text-terracotta">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
