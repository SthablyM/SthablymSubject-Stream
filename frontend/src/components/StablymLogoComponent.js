// src/components/StablymLogo.js
// Usage:
//   <StablymLogo />                  — full logo, dark bg (default)
//   <StablymLogo variant="light" />  — full logo, light bg
//   <StablymLogo variant="icon" />   — square icon only
//   <StablymLogo size="sm|md|lg" />  — size presets

import React from "react";

// ── Shared defs used by both variants ─────────────────────────────────────────
function Defs({ id = "" }) {
  return (
    <defs>
      <linearGradient id={`bgGrad${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#0f172a" />
        <stop offset="100%" stopColor="#1e3a5f" />
      </linearGradient>
      <linearGradient id={`iconGrad${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#38bdf8" />
        <stop offset="50%"  stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
      <linearGradient id={`textGrad${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
      <filter id={`glow${id}`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id={`iconGlow${id}`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

// ── Icon mark (the hexagon + S + graduation cap) ──────────────────────────────
function IconMark({ id = "", ox = 0, oy = 0 }) {
  const x = (n) => n + ox;
  const y = (n) => n + oy;
  return (
    <g filter={`url(#iconGlow${id})`}>
      {/* Outer hexagon */}
      <polygon
        points={`${x(50)},${y(18)} ${x(66)},${y(27)} ${x(66)},${y(45)} ${x(50)},${y(54)} ${x(34)},${y(45)} ${x(34)},${y(27)}`}
        fill="none" stroke={`url(#iconGrad${id})`} strokeWidth="2.5" opacity="0.9"
      />
      {/* Inner diamond accent */}
      <polygon
        points={`${x(50)},${y(24)} ${x(60)},${y(36)} ${x(50)},${y(48)} ${x(40)},${y(36)}`}
        fill={`url(#iconGrad${id})`} opacity="0.12"
      />
      {/* S upper arc */}
      <path
        d={`M${x(44)},${y(30)} Q${x(44)},${y(24)} ${x(50)},${y(24)} Q${x(56)},${y(24)} ${x(56)},${y(30)} Q${x(56)},${y(36)} ${x(50)},${y(36)}`}
        fill="none" stroke={`url(#iconGrad${id})`} strokeWidth="2.8" strokeLinecap="round"
      />
      {/* S lower arc */}
      <path
        d={`M${x(56)},${y(36)} Q${x(56)},${y(42)} ${x(50)},${y(42)} Q${x(44)},${y(42)} ${x(44)},${y(48)}`}
        fill="none" stroke={`url(#iconGrad${id})`} strokeWidth="2.8" strokeLinecap="round"
      />
      {/* Cap brim */}
      <line x1={x(38)} y1={y(20)} x2={x(62)} y2={y(20)}
            stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
      {/* Cap top */}
      <polygon points={`${x(50)},${y(13)} ${x(56)},${y(20)} ${x(44)},${y(20)}`} fill="#6366f1" opacity="0.9" />
      {/* Tassel stem */}
      <line x1={x(62)} y1={y(20)} x2={x(65)} y2={y(26)}
            stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
      {/* Tassel dot */}
      <circle cx={x(65)} cy={y(27)} r="1.8" fill="#a78bfa" />
    </g>
  );
}

// ── FULL LOGO (dark) ──────────────────────────────────────────────────────────
function FullLogoDark({ width, height }) {
  const id = "d";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 100" width={width} height={height} role="img" aria-label="Sthablym logo">
      <Defs id={id} />
      {/* Background */}
      <rect x="0" y="0" width="320" height="100" rx="18" fill={`url(#bgGrad${id})`} />
      <rect x="0" y="0" width="320" height="100" rx="18" fill="none" stroke="#1e40af" strokeWidth="0.5" opacity="0.3" />

      {/* Icon */}
      <IconMark id={id} ox={0} oy={0} />

      {/* Wordmark */}
      <text x="84" y="52"
        fontFamily="Georgia, Palatino, serif"
        fontSize="32" fontWeight="700" letterSpacing="3"
        fill={`url(#textGrad${id})`} filter={`url(#glow${id})`}>
        STABLYM
      </text>

      {/* Tagline */}
      <text x="85" y="68"
        fontFamily="'Trebuchet MS', 'Gill Sans', sans-serif"
        fontSize="9.5" fontWeight="400" letterSpacing="4.5"
        fill="#64748b">
        SUBJECT STREAM SELECTOR
      </text>

      {/* Accent line */}
      <line x1="84" y1="72" x2="295" y2="72" stroke={`url(#iconGrad${id})`} strokeWidth="1" opacity="0.5" />

      {/* ZA badge */}
      <rect x="270" y="76" width="28" height="16" rx="4" fill="#1e3a5f" stroke="#38bdf8" strokeWidth="0.8" />
      <text x="284" y="88"
        fontFamily="'Trebuchet MS', sans-serif"
        fontSize="8" fontWeight="700" fill="#38bdf8" textAnchor="middle" letterSpacing="1">
        ZA
      </text>
    </svg>
  );
}

// ── FULL LOGO (light bg) ──────────────────────────────────────────────────────
function FullLogoLight({ width, height }) {
  const id = "l";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 100" width={width} height={height} role="img" aria-label="Sthablym logo">
      <defs>
        <linearGradient id={`iconGrad${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
        <filter id={`iconGlow${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* No background — transparent for light contexts */}
      <IconMark id={id} ox={0} oy={0} />

      <text x="84" y="52"
        fontFamily="Georgia, Palatino, serif"
        fontSize="32" fontWeight="700" letterSpacing="3"
        fill="#1e293b">
        STHABLYM
      </text>

      <text x="85" y="68"
        fontFamily="'Trebuchet MS', 'Gill Sans', sans-serif"
        fontSize="9.5" fontWeight="400" letterSpacing="4.5"
        fill="#94a3b8">
        SUBJECT STREAM SELECTOR
      </text>

      <line x1="84" y1="72" x2="275" y2="72" stroke={`url(#iconGrad${id})`} strokeWidth="1" opacity="0.4" />

      <rect x="250" y="76" width="28" height="16" rx="4" fill="#eff6ff" stroke="#2563eb" strokeWidth="0.8" />
      <text x="264" y="88"
        fontFamily="'Trebuchet MS', sans-serif"
        fontSize="8" fontWeight="700" fill="#2563eb" textAnchor="middle" letterSpacing="1">
        ZA
      </text>
    </svg>
  );
}

// ── ICON ONLY ─────────────────────────────────────────────────────────────────
function IconOnly({ size }) {
  const id = "i";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} role="img" aria-label="Sthablym icon">
      <defs>
        <linearGradient id={`bgG${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e3a5f" />
        </linearGradient>
        <linearGradient id={`iG${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#38bdf8" />
          <stop offset="50%"  stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <filter id={`glow${id}`}>
          <feGaussianBlur stdDeviation="1.5" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <rect width="64" height="64" rx="14" fill={`url(#bgG${id})`} />

      <g filter={`url(#glow${id})`}>
        <polygon points="32,8 46,16 46,32 32,40 18,32 18,16"
                 fill="none" stroke={`url(#iG${id})`} strokeWidth="2" opacity="0.9" />
        <path d="M25,19 Q25,13 32,13 Q39,13 39,19 Q39,25 32,25"
              fill="none" stroke={`url(#iG${id})`} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M39,25 Q39,31 32,31 Q25,31 25,37"
              fill="none" stroke={`url(#iG${id})`} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="20" y1="10" x2="44" y2="10" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
        <polygon points="32,4 38,10 26,10" fill="#6366f1" opacity="0.9" />
        <line x1="44" y1="10" x2="47" y2="17" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="47" cy="18" r="1.5" fill="#a78bfa" />
      </g>

      <text x="32" y="57"
        fontFamily="Georgia, serif"
        fontSize="9" fontWeight="700"
        fill="#cbd5e1" textAnchor="middle" letterSpacing="1.5">
        STHABLYM
      </text>
    </svg>
  );
}

// ── EXPORTED COMPONENT ────────────────────────────────────────────────────────
const SIZE_MAP = {
  xs:  { w: 160, h: 50  },
  sm:  { w: 200, h: 63  },
  md:  { w: 280, h: 88  },
  lg:  { w: 320, h: 100 },
  xl:  { w: 400, h: 125 },
};

export default function StablymLogo({ variant = "dark", size = "md" }) {
  const dims = SIZE_MAP[size] || SIZE_MAP.md;

  if (variant === "icon") return <IconOnly size={dims.w / 3} />;
  if (variant === "light") return <FullLogoLight width={dims.w} height={dims.h} />;
  return <FullLogoDark width={dims.w} height={dims.h} />;
}