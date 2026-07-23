// src/app/[lang]/contact/page.tsx
'use client';

import React, { useState, use } from 'react';
import emailjs from '@emailjs/browser';
import { getDictionary } from '@/lib/get-dictionary';
import { GridPattern, OrganicBlob } from '@/components/brand/PatternBackground';
import { Mail, Phone, MapPin, Send, AlertCircle, CheckCircle2, Navigation } from 'lucide-react';

const CONTACT_ADDRESS_QUERY = 'Checkpoint, Buea, Cameroon';
const GOOGLE_MAPS_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(CONTACT_ADDRESS_QUERY)}&output=embed`;
const GOOGLE_MAPS_DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_ADDRESS_QUERY)}`;

interface ContactPageProps {
  params: Promise<{ lang: string }>;
}

export default function ContactPage({ params }: ContactPageProps) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang === 'en' ? 'en' : 'fr';
  const [dict, setDict] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Load dictionary on client
  React.useEffect(() => {
    getDictionary(lang).then((d) => setDict(d));
  }, [lang]);

  if (!dict) return <div className="min-h-screen flex items-center justify-center font-bold">Loading...</div>;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setStatus('error');
        return;
      }

      setStatus('success');

      // Fire-and-forget: notify the team + send the sender a personalized auto-reply.
      // Message is already saved in the database above, so an email hiccup here
      // must not flip the UI back to an error state.
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const notifyTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_NOTIFY;
      const autoReplyTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_AUTOREPLY;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (serviceId && notifyTemplateId && autoReplyTemplateId && publicKey) {
        const options = { publicKey };
        Promise.all([
          emailjs.send(
            serviceId,
            notifyTemplateId,
            {
              from_name: formData.name,
              from_email: formData.email,
              subject: formData.subject,
              message: formData.message,
              to_email: 'africaimpactstudio@gmail.com',
            },
            options
          ),
          emailjs.send(
            serviceId,
            autoReplyTemplateId,
            {
              to_name: formData.name,
              to_email: formData.email,
              subject: formData.subject,
            },
            options
          ),
        ]).catch((err) => console.error('EmailJS send failed:', err));
      } else {
        console.warn('EmailJS env vars are not configured; skipping email notifications.');
      }

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen py-16 px-6">
      <GridPattern />
      <OrganicBlob color="terracotta" className="top-10 -left-20 opacity-30" />
      <OrganicBlob color="green" className="bottom-20 -right-20 opacity-20" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-4">
          <span className="text-xs uppercase tracking-widest font-extrabold text-terracotta">
            {lang === 'fr' ? 'Prendre Contact' : 'Get In Touch'}
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-deep-green dark:text-off-white">
            {dict.contact.title}
          </h1>
          <p className="text-sm md:text-base text-deep-green/70 dark:text-off-white/70 font-semibold leading-relaxed">
            {dict.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Contact Details & Map (Left) */}
          <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
            {/* Info card */}
            <div className="p-8 rounded-3xl glass border border-[var(--color-border)] shadow-sm flex flex-col gap-6">
              <h3 className="font-display font-bold text-lg text-deep-green dark:text-gold uppercase tracking-wider border-b border-[var(--color-border)]/50 pb-3">
                {dict.contact.details.title}
              </h3>
              
              <div className="flex flex-col gap-5 text-sm font-semibold text-deep-green/80 dark:text-off-white/80">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-terracotta mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-deep-green dark:text-off-white mb-0.5">{dict.contact.details.office}</h4>
                    <p className="opacity-75">{dict.contact.details.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-terracotta mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-deep-green dark:text-off-white mb-0.5">{lang === 'fr' ? 'Téléphone' : 'Phone'}</h4>
                    <p className="opacity-75">{dict.contact.details.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-terracotta mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-deep-green dark:text-off-white mb-0.5">Email</h4>
                    <p className="opacity-75">{dict.contact.details.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Real Google Maps embed pinned on the office location */}
            <div className="relative h-[250px] rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-2xl bg-deep-green/20">
              <iframe
                src={GOOGLE_MAPS_EMBED_SRC}
                title="Africa Impact Studio location"
                loading="lazy"
                style={{ border: 0 }}
                className="w-full h-full grayscale-[15%] contrast-[1.05]"
              />
              <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider font-extrabold pointer-events-none">
                📍 Africa Impact Studio HQ
              </div>
              <a
                href={GOOGLE_MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 glass px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-1.5 hover:bg-terracotta hover:text-white transition-colors cursor-pointer"
              >
                <Navigation className="w-3 h-3" />
                {lang === 'fr' ? 'Itinéraire' : 'Get Directions'}
              </a>
            </div>
          </div>

          {/* Form Card (Right) */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl glass border border-[var(--color-border)] shadow-2xl h-full flex flex-col justify-between">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-75">{dict.contact.form.name}</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jean Dupont"
                      className="px-4 py-3 rounded-xl bg-white dark:bg-charcoal-light border border-[var(--color-border)] focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-sm font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-75">{dict.contact.form.email}</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jean.dupont@gmail.com"
                      className="px-4 py-3 rounded-xl bg-white dark:bg-charcoal-light border border-[var(--color-border)] focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-75">{dict.contact.form.subject}</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={lang === 'fr' ? 'Partenariat, collaboration...' : 'Partnership, collaboration...'}
                    className="px-4 py-3 rounded-xl bg-white dark:bg-charcoal-light border border-[var(--color-border)] focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-sm font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-75">{dict.contact.form.message}</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={lang === 'fr' ? 'Écrivez votre message ici...' : 'Write your message here...'}
                    className="px-4 py-3 rounded-xl bg-white dark:bg-charcoal-light border border-[var(--color-border)] focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta text-sm font-semibold resize-none"
                  />
                </div>

                {status === 'success' && (
                  <div className="p-3.5 rounded-xl border border-green-500/25 bg-green-500/10 flex items-start gap-2.5 text-xs text-green-600 dark:text-green-400 font-semibold">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-0.5">
                      <span>{dict.contact.form.success}</span>
                      <span className="opacity-80 font-medium">{dict.contact.form.successDetail}</span>
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-3.5 rounded-xl border border-red-500/25 bg-red-500/10 flex items-center gap-2.5 text-xs text-red-600 dark:text-red-400 font-semibold">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{dict.contact.form.error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-3.5 rounded-xl bg-deep-green text-off-white dark:bg-terracotta hover:bg-deep-green-light dark:hover:bg-terracotta-light font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {status === 'loading' ? (lang === 'fr' ? 'Envoi...' : 'Sending...') : dict.contact.form.submit}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
