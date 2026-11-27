export function PortraitArt({ crop = false }) {
  return (
    <svg
      className="art art-portrait"
      viewBox="0 0 420 560"
      preserveAspectRatio={crop ? 'xMidYMid slice' : 'xMidYMid meet'}
      role="img"
      aria-label="Stylized portrait of Blank: a girl with long flowing blue hair, closed eyes, and a star clip."
    >
      <defs>
        <linearGradient id="p-bg" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#0a1a38" />
          <stop offset="55%" stopColor="#061229" />
          <stop offset="100%" stopColor="#030814" />
        </linearGradient>
        <radialGradient id="p-glow" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#4d8dff" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#2a5fd0" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2a5fd0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="p-moon" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#e6f0ff" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#9cc2ff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6f9cff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="p-hair" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#2b5cbf" />
          <stop offset="45%" stopColor="#173a86" />
          <stop offset="100%" stopColor="#0a1c44" />
        </linearGradient>
        <linearGradient id="p-hair-front" x1="0" y1="0" x2="1" y2="0.8">
          <stop offset="0%" stopColor="#3f74d8" />
          <stop offset="60%" stopColor="#1d4396" />
          <stop offset="100%" stopColor="#122f6b" />
        </linearGradient>
        <linearGradient id="p-skin" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#f6eef0" />
          <stop offset="55%" stopColor="#ecd9dd" />
          <stop offset="100%" stopColor="#d9c1c8" />
        </linearGradient>
        <linearGradient id="p-outfit" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#12294f" />
          <stop offset="55%" stopColor="#0a1a38" />
          <stop offset="100%" stopColor="#050d1f" />
        </linearGradient>
        <linearGradient id="p-shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8ec5ff" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>
        <filter id="p-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <rect width="420" height="560" fill="url(#p-bg)" />
      <circle cx="210" cy="230" r="210" fill="url(#p-glow)" />
      <circle cx="210" cy="205" r="132" fill="url(#p-moon)" />

      <g fill="#bfe0ff">
        <circle cx="92" cy="96" r="1.8" opacity="0.6" />
        <circle cx="330" cy="128" r="1.4" opacity="0.5" />
        <circle cx="352" cy="238" r="2" opacity="0.35" />
        <circle cx="76" cy="250" r="1.5" opacity="0.45" />
        <circle cx="300" cy="72" r="1.2" opacity="0.7" />
        <circle cx="130" cy="330" r="1.6" opacity="0.3" />
        <circle cx="320" cy="330" r="1.3" opacity="0.35" />
      </g>

      {/* hair, back layer */}
      <path
        d="M210 82c-68 0-104 48-106 110-2 46-10 80-20 118-8 30-4 62 10 76 12 12 30 4 38-14 10-22 6-56 14-88h128c8 32 4 66 14 88 8 18 26 26 38 14 14-14 18-46 10-76-10-38-18-72-20-118-2-62-38-110-106-110Z"
        fill="url(#p-hair)"
      />

      {/* neck + shoulders */}
      <path d="M186 240h48v50c0 10-48 10-48 0Z" fill="url(#p-skin)" />
      <ellipse cx="210" cy="252" rx="30" ry="9" fill="#c9aab2" opacity="0.25" />
      <path
        d="M80 560c2-112 46-262 130-262s128 150 130 262Z"
        fill="url(#p-outfit)"
      />
      <path
        d="M166 306c14 16 30 24 44 24s30-8 44-24l10 20c-14 20-34 30-54 30s-40-10-54-30Z"
        fill="#0b1b3a"
      />
      <path
        d="M166 306c14 16 30 24 44 24s30-8 44-24"
        fill="none"
        stroke="#5b8fe0"
        strokeOpacity="0.6"
        strokeWidth="1.5"
      />
      <path
        d="M120 402c14-24 32-40 52-46M300 402c-14-24-32-40-52-46"
        fill="none"
        stroke="#4f83d4"
        strokeOpacity="0.35"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* face */}
      <ellipse cx="210" cy="196" rx="55" ry="65" fill="url(#p-skin)" />
      <ellipse cx="155" cy="205" rx="8" ry="14" fill="#e7d2d7" opacity="0.9" />
      <ellipse cx="265" cy="205" rx="8" ry="14" fill="#e7d2d7" opacity="0.9" />

      {/* fringe */}
      <path
        d="M152 190c-4-56 26-92 60-92 36 0 66 30 70 84-16-30-42-48-70-42-26 6-44 24-60 50Z"
        fill="url(#p-hair-front)"
      />
      <path
        d="M212 100c-20 4-36 18-46 40 12-12 26-20 44-24 20-4 38 0 52 12-10-20-28-32-50-28Z"
        fill="#6ea3ff"
        opacity="0.28"
      />
      <path
        d="M168 108c14-14 30-20 46-20 22 0 42 8 56 24-18-8-38-10-58-4-16 4-30 12-44 24Z"
        fill="#4d86e8"
        opacity="0.35"
      />

      {/* side locks */}
      <path
        d="M158 172c-8 44-10 92-20 134-6 26-12 54-8 78"
        fill="none"
        stroke="url(#p-hair-front)"
        strokeWidth="17"
        strokeLinecap="round"
      />
      <path
        d="M262 172c8 44 10 92 20 134 6 26 12 54 8 78"
        fill="none"
        stroke="url(#p-hair-front)"
        strokeWidth="17"
        strokeLinecap="round"
      />

      {/* features */}
      <path
        d="M177 189q11-7 22-1M221 188q11-6 22 1"
        fill="none"
        stroke="#4a5570"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M178 204q11 8 22 0"
        fill="none"
        stroke="#3a4460"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M220 204q11 8 22 0"
        fill="none"
        stroke="#3a4460"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M177 201l-6-3M243 201l6-3"
        stroke="#3a4460"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M210 212v10q0 4-4 5"
        fill="none"
        stroke="#c49a9f"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M198 240q12 7 24 0"
        fill="none"
        stroke="#b07b84"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.75"
      />
      <ellipse cx="172" cy="224" rx="12" ry="6" fill="#e8a7ad" opacity="0.16" />
      <ellipse cx="248" cy="224" rx="12" ry="6" fill="#e8a7ad" opacity="0.16" />

      {/* earrings */}
      <circle cx="155" cy="224" r="6" fill="#8ef0ff" opacity="0.12" />
      <circle cx="155" cy="224" r="2.2" fill="#8ef0ff" />
      <circle cx="265" cy="224" r="6" fill="#8ef0ff" opacity="0.12" />
      <circle cx="265" cy="224" r="2.2" fill="#8ef0ff" />

      {/* hair highlights */}
      <g fill="none" stroke="url(#p-shine)" strokeLinecap="round">
        <path d="M150 152c-6 62-14 132-24 196" strokeWidth="2" opacity="0.35" />
        <path d="M270 152c6 62 14 132 24 196" strokeWidth="2" opacity="0.35" />
        <path d="M190 100c-18 8-30 24-36 46" strokeWidth="1.6" opacity="0.45" />
        <path d="M256 132c-12 10-18 26-20 46" strokeWidth="1.4" opacity="0.25" />
      </g>

      {/* star clip */}
      <circle cx="156" cy="148" r="14" fill="#67e8f9" opacity="0.18" filter="url(#p-soft)" />
      <path
        d="M156 134l4.5 9.5L170 148l-9.5 4.5L156 162l-4.5-9.5L142 148l9.5-4.5Z"
        fill="#8ef0ff"
      />

      {/* drifting particles */}
      <g fill="#8ef0ff">
        <circle cx="118" cy="196" r="2.4" opacity="0.55" />
        <circle cx="306" cy="184" r="1.8" opacity="0.45" />
        <circle cx="330" cy="292" r="2.2" opacity="0.3" />
        <circle cx="86" cy="318" r="1.7" opacity="0.35" />
        <circle cx="292" cy="122" r="1.5" opacity="0.6" />
      </g>
    </svg>
  )
}

export function DreamscapeArt() {
  return (
    <svg
      className="art art-dreamscape"
      viewBox="0 0 800 500"
      role="img"
      aria-label="A still midnight-blue ocean under a starry sky with a low moon and distant cliffs."
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="d-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#040b1c" />
          <stop offset="55%" stopColor="#0a1e44" />
          <stop offset="100%" stopColor="#133563" />
        </linearGradient>
        <linearGradient id="d-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16406f" />
          <stop offset="45%" stopColor="#0a2148" />
          <stop offset="100%" stopColor="#040c1d" />
        </linearGradient>
        <radialGradient id="d-moonglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.7" />
          <stop offset="35%" stopColor="#7fb0ff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#7fb0ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="d-reflect" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cfe4ff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
        </linearGradient>
        <filter id="d-blur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#d-sky)" />

      <g fill="#cfe4ff">
        <circle cx="70" cy="60" r="1.5" opacity="0.7" />
        <circle cx="150" cy="110" r="1" opacity="0.5" />
        <circle cx="240" cy="48" r="1.8" opacity="0.6" />
        <circle cx="330" cy="130" r="1.1" opacity="0.4" />
        <circle cx="430" cy="66" r="1.6" opacity="0.55" />
        <circle cx="520" cy="150" r="1" opacity="0.4" />
        <circle cx="700" cy="90" r="1.4" opacity="0.6" />
        <circle cx="740" cy="190" r="1" opacity="0.35" />
        <circle cx="120" cy="200" r="1.2" opacity="0.35" />
        <circle cx="380" cy="210" r="1.4" opacity="0.3" />
      </g>

      <circle cx="610" cy="118" r="130" fill="url(#d-moonglow)" />
      <circle cx="610" cy="118" r="44" fill="#e8f1ff" opacity="0.92" />
      <circle cx="596" cy="106" r="7" fill="#cddff7" opacity="0.55" />
      <circle cx="626" cy="130" r="4" fill="#cddff7" opacity="0.4" />

      {/* distant cliffs */}
      <path
        d="M0 300l38-58 26 26 34-52 30 44 28-18 26 40 22-22 20 40Z"
        fill="#061126"
        opacity="0.9"
      />
      <path
        d="M800 300l-44-66-24 24-30-46-32 40-26-16-24 38-20-20-22 46Z"
        fill="#050e20"
        opacity="0.95"
      />

      {/* mist */}
      <ellipse cx="400" cy="292" rx="330" ry="22" fill="#7fb0ff" opacity="0.12" filter="url(#d-blur)" />

      <rect y="288" width="800" height="212" fill="url(#d-sea)" />
      <path d="M0 288h800" stroke="#7fb0ff" strokeOpacity="0.35" strokeWidth="1" />

      {/* moon reflection */}
      <path
        d="M596 288h28l16 120-22 60h-16l-22-60Z"
        fill="url(#d-reflect)"
        opacity="0.5"
      />

      {/* wave lines */}
      <g fill="none" stroke="#8ec5ff" strokeLinecap="round">
        <path d="M40 330q60-8 120 0t120 0" opacity="0.16" />
        <path d="M470 350q70-9 140 0t150 0" opacity="0.14" />
        <path d="M120 386q80-10 160 0t160 0" opacity="0.12" />
        <path d="M40 430q90-11 180 0t180 0" opacity="0.1" />
        <path d="M420 462q80-10 160 0t180 0" opacity="0.09" />
      </g>

      {/* small boat */}
      <g opacity="0.85">
        <path d="M232 318l30 0 6 8h-42Z" fill="#040c1c" />
        <path d="M247 318v-18l14 10-14 4Z" fill="#040c1c" />
        <circle cx="247" cy="296" r="2" fill="#f3d9a4" opacity="0.9" />
      </g>
      <path d="M240 330h28l-4 18h-20Z" fill="#f3d9a4" opacity="0.06" />

      {/* floating particles */}
      <g fill="#8ef0ff">
        <circle cx="180" cy="250" r="2" opacity="0.5" />
        <circle cx="360" cy="270" r="1.6" opacity="0.4" />
        <circle cx="660" cy="250" r="2.2" opacity="0.45" />
        <circle cx="720" cy="330" r="1.4" opacity="0.3" />
      </g>
    </svg>
  )
}

export function UndertowArt() {
  return (
    <svg
      className="art art-undertow"
      viewBox="0 0 400 400"
      role="img"
      aria-label="Abstract concentric blue ripples pulling toward a glowing centre."
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="u-bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#123a7a" />
          <stop offset="55%" stopColor="#081c40" />
          <stop offset="100%" stopColor="#030a18" />
        </radialGradient>
        <radialGradient id="u-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a5f3ff" />
          <stop offset="35%" stopColor="#4d8dff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#4d8dff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="u-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8ec5ff" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>
      </defs>

      <rect width="400" height="400" fill="url(#u-bg)" />
      <circle cx="200" cy="200" r="150" fill="url(#u-core)" opacity="0.35" />

      <g fill="none" stroke="url(#u-ring)">
        {Array.from({ length: 14 }, (_, i) => (
          <ellipse
            key={i}
            cx="200"
            cy="200"
            rx={18 + i * 14}
            ry={12 + i * 11}
            opacity={0.5 - i * 0.028}
            strokeWidth={1.4}
            transform={`rotate(${i * 4} 200 200)`}
          />
        ))}
      </g>

      <circle cx="200" cy="200" r="7" fill="#d9f7ff" />
      <circle cx="200" cy="200" r="16" fill="#8ef0ff" opacity="0.25" />
      <circle cx="200" cy="200" r="26" fill="#8ef0ff" opacity="0.1" />

      <g fill="#8ef0ff">
        <circle cx="96" cy="118" r="2" opacity="0.6" />
        <circle cx="310" cy="150" r="1.6" opacity="0.5" />
        <circle cx="270" cy="300" r="2.2" opacity="0.35" />
        <circle cx="120" cy="290" r="1.4" opacity="0.4" />
      </g>
    </svg>
  )
}
