// src/components/ui/TabSection.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Target, Eye, Sparkles } from 'lucide-react';

interface TabSectionProps {
  dict: any;
}

export default function TabSection({ dict }: TabSectionProps) {
  const [activeTab, setActiveTab] = useState<'story' | 'mission' | 'vision' | 'values'>('story');

  const tabs = [
    { id: 'story', label: dict.about.storyTitle, icon: BookOpen },
    { id: 'mission', label: dict.about.missionTitle, icon: Target },
    { id: 'vision', label: dict.about.visionTitle, icon: Eye },
    { id: 'values', label: dict.about.valuesTitle, icon: Sparkles },
  ] as const;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Tabs list */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--color-border)] pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-bold transition-all relative cursor-pointer ${
                isActive
                  ? 'text-terracotta dark:text-gold'
                  : 'text-deep-green/70 dark:text-off-white/60 hover:text-terracotta'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-tab-line"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta dark:bg-gold"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tabs content */}
      <div className="min-h-[160px] p-6 rounded-2xl glass border border-[var(--color-border)] shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-sm md:text-base leading-relaxed"
          >
            {activeTab === 'story' && (
              <p className="text-deep-green/80 dark:text-off-white/80 font-medium">
                {dict.about.story}
              </p>
            )}
            {activeTab === 'mission' && (
              <p className="text-deep-green/80 dark:text-off-white/80 font-medium">
                {dict.about.mission}
              </p>
            )}
            {activeTab === 'vision' && (
              <p className="text-deep-green/80 dark:text-off-white/80 font-medium">
                {dict.about.vision}
              </p>
            )}
            {activeTab === 'values' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-deep-green/5 dark:bg-white/5 border border-[var(--color-border)]">
                  <h4 className="font-bold text-terracotta dark:text-gold mb-1">
                    {dict.about.values.innovation}
                  </h4>
                  <p className="text-deep-green/70 dark:text-off-white/70">
                    {dict.about.values.innovationDesc}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-deep-green/5 dark:bg-white/5 border border-[var(--color-border)]">
                  <h4 className="font-bold text-terracotta dark:text-gold mb-1">
                    {dict.about.values.impact}
                  </h4>
                  <p className="text-deep-green/70 dark:text-off-white/70">
                    {dict.about.values.impactDesc}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-deep-green/5 dark:bg-white/5 border border-[var(--color-border)]">
                  <h4 className="font-bold text-terracotta dark:text-gold mb-1">
                    {dict.about.values.identity}
                  </h4>
                  <p className="text-deep-green/70 dark:text-off-white/70">
                    {dict.about.values.identityDesc}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-deep-green/5 dark:bg-white/5 border border-[var(--color-border)]">
                  <h4 className="font-bold text-terracotta dark:text-gold mb-1">
                    {dict.about.values.excellence}
                  </h4>
                  <p className="text-deep-green/70 dark:text-off-white/70">
                    {dict.about.values.excellenceDesc}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
