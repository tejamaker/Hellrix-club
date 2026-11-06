import React from 'react';

interface HellrixLogoProps {
  variant?: 'full' | 'icon' | 'badge' | 'wordmark' | 'emblem';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Pure Vector HELLRIX Distressed Star Emblem & Wordmark
 * Strictly uses vector geometry and typography — NEVER displays the raw uploaded poster image.
 */
export const HellrixStarSvg: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 36,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
      aria-label="HELLRIX Emblem"
    >
      <defs>
        <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF1E42" stopOpacity="1" />
          <stop offset="65%" stopColor="#C8102E" stopOpacity="1" />
          <stop offset="100%" stopColor="#600512" stopOpacity="1" />
        </radialGradient>
        <filter id="distressFilter" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* Outer Distressed Red Star */}
      <polygon
        points="50,4 62,37 97,37 68,58 79,93 50,71 21,93 32,58 3,37 38,37"
        fill="url(#starGlow)"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        filter="url(#distressFilter)"
      />

      {/* Sharp Inner Star Contour */}
      <polygon
        points="50,16 58,40 84,40 62,56 70,82 50,65 30,82 38,56 16,40 42,40"
        fill="#090909"
        stroke="#C8102E"
        strokeWidth="1.2"
      />

      {/* Center Raw Core Spike */}
      <polygon
        points="50,28 54,43 70,43 57,52 62,68 50,58 38,68 43,52 30,43 46,43"
        fill="#C8102E"
      />

      {/* Industrial Crosshair Center Dot */}
      <circle cx="50" cy="50" r="2.5" fill="#FFFFFF" />
      <line x1="50" y1="42" x2="50" y2="58" stroke="#FFFFFF" strokeWidth="0.8" />
      <line x1="42" y1="50" x2="58" y2="50" stroke="#FFFFFF" strokeWidth="0.8" />
    </svg>
  );
};

export const HellrixLogo: React.FC<HellrixLogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
}) => {
  const sizeMap = {
    sm: { px: 24, text: 'text-base', sub: 'text-[8px]', height: 'h-6' },
    md: { px: 34, text: 'text-2xl', sub: 'text-[9px]', height: 'h-9' },
    lg: { px: 46, text: 'text-4xl', sub: 'text-[11px]', height: 'h-12' },
    xl: { px: 68, text: 'text-6xl', sub: 'text-xs', height: 'h-16' },
  };

  const current = sizeMap[size];

  if (variant === 'icon' || variant === 'emblem') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <HellrixStarSvg size={current.px} />
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <span
        className={`font-display font-black tracking-tight text-[#E5DED3] uppercase select-none ${current.text} ${className}`}
      >
        HELL<span className="text-[#C8102E]">RIX</span>
      </span>
    );
  }

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center gap-2.5 border-2 border-black bg-[#121212] px-3 py-1 shadow-[3px_3px_0px_#000000] select-none ${className}`}
      >
        <HellrixStarSvg size={20} />
        <span className="font-display font-black tracking-tight text-white uppercase text-sm">
          HELL<span className="text-[#C8102E]">RIX</span>{' '}
          <span className="text-[#77716D] text-[10px] font-mono-editorial">1.0</span>
        </span>
      </div>
    );
  }

  // Default 'full': Pure Vector Star + Typography
  return (
    <div className={`group inline-flex items-center gap-2.5 select-none ${current.height} ${className}`}>
      <HellrixStarSvg size={current.px} />
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`font-display font-black tracking-tight text-[#E5DED3] uppercase group-hover:text-white transition-colors ${current.text}`}
        >
          HELL<span className="text-[#C8102E]">RIX</span>
        </span>
        <span
          className={`font-mono-editorial text-[#77716D] tracking-widest uppercase mt-0.5 ${current.sub}`}
        >
          EDITION 1.0
        </span>
      </div>
    </div>
  );
};
