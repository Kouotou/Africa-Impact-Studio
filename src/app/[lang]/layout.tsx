// src/app/[lang]/layout.tsx
import React from 'react';
import { getDictionary } from '@/lib/get-dictionary';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LeGardienChatbot from '@/components/chatbot/LeGardienChatbot';

export async function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const currentLang = lang === 'en' ? 'en' : 'fr';
  const dict = await getDictionary(currentLang);

  return (
    <div className="flex flex-col min-h-screen">
      <Header lang={currentLang} dict={dict} />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer lang={currentLang} dict={dict} />
      <LeGardienChatbot lang={currentLang} dict={dict} />
    </div>
  );
}
