// src/components/brand/PatternBackground.tsx
import React from 'react';

export function GridPattern() {
  return (
    <div className="absolute inset-0 bg-pattern-geo opacity-70 pointer-events-none -z-10" />
  );
}

export function GeometricDivider() {
  return (
    <div className="w-full flex items-center justify-center gap-1.5 py-4 overflow-hidden opacity-30 select-none pointer-events-none">
      <div className="h-px bg-gradient-to-r from-transparent to-terracotta w-1/3"></div>
      {/* Kente-like modern diamond cross vector */}
      <svg width="24" height="24" viewBox="0 0 24 24" className="text-terracotta fill-none stroke-current stroke-2">
        <path d="M12 2L2 12l10 10 10-10L12 2z" />
        <path d="M12 6L6 12l6 6 6-6-6-6z" />
        <circle cx="12" cy="12" r="2" className="fill-current text-gold" />
      </svg>
      <div className="h-px bg-gradient-to-l from-transparent to-terracotta w-1/3"></div>
    </div>
  );
}

export function OrganicBlob({ color = 'terracotta', className = '' }: { color?: 'terracotta' | 'green' | 'gold'; className?: string }) {
  const colorMap = {
    terracotta: 'bg-terracotta/8 dark:bg-terracotta/5',
    green: 'bg-deep-green/6 dark:bg-deep-green/4',
    gold: 'bg-gold/8 dark:bg-gold/5',
  };

  return (
    <div
      className={`absolute rounded-full blur-3xl -z-10 pointer-events-none animate-float ${colorMap[color]} ${className}`}
      style={{
        width: '35vw',
        height: '35vw',
        maxHeight: '450px',
        maxWidth: '450px',
      }}
    />
  );
}

export function AfricanBorderPattern() {
  return (
    <div className="w-full h-2 bg-gradient-terracotta-gold relative overflow-hidden opacity-85 select-none pointer-events-none">
      <svg width="100% " height="8" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0">
        <defs>
          <pattern id="border-kente" width="24" height="8" patternUnits="userSpaceOnUse">
            <path d="M0 0 L12 8 L24 0" fill="none" stroke="#0B3C2B" strokeWidth="2" />
            <path d="M12 8 L12 0" fill="none" stroke="#FAFAF7" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="8" fill="url(#border-kente)" />
      </svg>
    </div>
  );
}
