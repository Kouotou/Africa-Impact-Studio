// src/components/layout/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Globe, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  lang: 'fr' | 'en';
  dict: any;
}

export default function Header({ lang, dict }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Detect scroll to style the header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  const handleLanguageChange = () => {
    const nextLang = lang === 'fr' ? 'en' : 'fr';
    // Replace the language segment in the pathname
    const newPath = pathname.replace(`/${lang}`, `/${nextLang}`);
    router.push(newPath);
  };

  const navItems = [
    { label: dict.nav.home, href: `/${lang}` },
    { label: dict.nav.about, href: `/${lang}#about` },
    { label: dict.nav.projects, href: `/${lang}#projects` },
    { label: dict.nav.blog, href: `/${lang}/blog` },
    { label: dict.nav.resources, href: `/${lang}/resources` },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass py-3 shadow-sm border-b border-[var(--color-border)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-terracotta-gold flex items-center justify-between p-2 shadow-md overflow-hidden">
            {/* Geometric African shape inside logo */}
            <div className="absolute inset-0 bg-deep-green/10 opacity-30 mix-blend-overlay"></div>
            <span className="text-white font-display font-extrabold text-xl z-10">A</span>
            <span className="text-gold font-display font-extrabold text-xl z-10">I</span>
            <span className="text-white font-display font-extrabold text-xl z-10">S</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg leading-tight tracking-wide text-terracotta dark:text-gold transition-colors">
              AFRICA IMPACT
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold text-deep-green dark:text-off-white/80">
              STUDIO
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold hover:text-terracotta transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Action Controls (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-deep-green/5 dark:hover:bg-off-white/5 transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gold" />
            ) : (
              <Moon className="w-5 h-5 text-deep-green" />
            )}
          </button>

          {/* Lang Toggle */}
          <button
            onClick={handleLanguageChange}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-border)] hover:bg-deep-green/5 dark:hover:bg-off-white/5 transition-colors text-xs font-semibold cursor-pointer"
          >
            <Globe className="w-4 h-4 text-terracotta" />
            <span className="uppercase">{lang === 'fr' ? 'EN' : 'FR'}</span>
          </button>

          {/* Contact CTA */}
          <Link
            href={`/${lang}/contact`}
            className="px-5 py-2.5 rounded-xl bg-deep-green text-off-white dark:bg-terracotta hover:bg-deep-green-light dark:hover:bg-terracotta-light shadow-md text-sm font-bold transition-all transform hover:-translate-y-0.5 duration-200"
          >
            {dict.nav.contact}
          </Link>
        </div>

        {/* Mobile Menu Controls */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-deep-green/5 dark:hover:bg-off-white/5 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gold" />
            ) : (
              <Moon className="w-5 h-5 text-deep-green" />
            )}
          </button>
          
          <button
            onClick={handleLanguageChange}
            className="p-2 rounded-lg hover:bg-deep-green/5 dark:hover:bg-off-white/5 transition-colors text-xs font-semibold"
          >
            <span className="uppercase text-terracotta font-bold">{lang === 'fr' ? 'EN' : 'FR'}</span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-deep-green dark:text-off-white hover:bg-deep-green/5 dark:hover:bg-off-white/5 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass shadow-lg border-b border-[var(--color-border)] animate-fade-in">
          <nav className="flex flex-col p-6 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-bold py-2 border-b border-[var(--color-border)]/50 hover:text-terracotta transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={`/${lang}/contact`}
              onClick={() => setIsOpen(false)}
              className="mt-2 w-full text-center py-3 rounded-xl bg-deep-green text-off-white dark:bg-terracotta hover:bg-deep-green-light font-bold transition-colors"
            >
              {dict.nav.contact}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
