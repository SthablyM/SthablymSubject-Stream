<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="bgG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e3a5f"/>
    </linearGradient>
    <linearGradient id="iG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#38bdf8"/>
      <stop offset="50%" style="stop-color:#6366f1"/>
      <stop offset="100%" style="stop-color:#a78bfa"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="1.5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#bgG)"/>
  <g filter="url(#glow)">
    <polygon points="32,8 46,16 46,32 32,40 18,32 18,16"
             fill="none" stroke="url(#iG)" stroke-width="2"/>
    <path d="M25,19 Q25,13 32,13 Q39,13 39,19 Q39,25 32,25"
          fill="none" stroke="url(#iG)" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M39,25 Q39,31 32,31 Q25,31 25,37"
          fill="none" stroke="url(#iG)" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="20" y1="10" x2="44" y2="10" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
    <polygon points="32,4 38,10 26,10" fill="#6366f1"/>
    <line x1="44" y1="10" x2="47" y2="17" stroke="#a78bfa" stroke-width="1.2" stroke-linecap="round"/>
    <circle cx="47" cy="18" r="1.5" fill="#a78bfa"/>
  </g>
  <text x="32" y="56" font-family="Georgia,serif" font-size="9" font-weight="700"
        fill="#cbd5e1" text-anchor="middle" letter-spacing="1.5">STHABLYM</text>
</svg>