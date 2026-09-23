import React from 'react';
import { NatureCanvas } from './NatureCanvas';

export const MeadowBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Base Sky Gradient: Golden Hour Dawn / Dusk */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 25% 15%, #fff7dc 0%, #fed8b8 25%, #f6c3cb 55%, #deb3c7 75%, #b28ea7 100%)',
        }}
      />

      {/* 2. Golden Bokeh Orbs and Sun Flare Circles */}
      <div className="absolute top-[12%] left-[18%] w-48 h-48 rounded-full bg-amber-100/40 blur-2xl animate-breathe" />
      <div className="absolute top-[28%] right-[15%] w-36 h-36 rounded-full bg-rose-200/35 blur-xl" />
      <div className="absolute bottom-[20%] left-[8%] w-56 h-56 rounded-full bg-amber-200/30 blur-2xl" />

      {/* 3. Real-Physics Nature Canvas: Dynamic Sunlight Rays, Cloud Shades & Multi-Colored Flying Flowers in Wind */}
      <NatureCanvas />

      {/* 4. Softly Blurred Atmospheric Clouds Drifting Slowly Across the Horizon */}
      <div className="absolute top-[35%] sm:top-[38%] left-0 right-0 h-44 overflow-hidden pointer-events-none z-0">
        {/* Deep Horizon Cloud Bank - Slowest */}
        <div className="absolute inset-0 flex items-center animate-cloud-drift-2 opacity-65 filter blur-2xl pointer-events-none">
          <div className="w-[450px] h-28 rounded-full bg-linear-to-r from-rose-200/50 via-amber-100/60 to-purple-200/40 shrink-0 transform -translate-y-4" />
          <div className="w-[580px] h-36 rounded-full bg-linear-to-r from-amber-100/60 via-pink-200/50 to-orange-100/40 shrink-0 -ml-24 transform translate-y-2" />
          <div className="w-[480px] h-32 rounded-full bg-linear-to-r from-purple-100/40 via-rose-100/60 to-amber-200/50 shrink-0 -ml-20 transform -translate-y-2" />
          <div className="w-[520px] h-30 rounded-full bg-linear-to-r from-amber-200/50 via-orange-100/50 to-rose-200/40 shrink-0 -ml-24" />
        </div>

        {/* Foreground Horizon Cloud Layer - Softly Glowing & Blurry */}
        <div className="absolute inset-0 flex items-center animate-cloud-drift-1 opacity-75 filter blur-xl pointer-events-none">
          <div className="w-[360px] h-24 rounded-full bg-linear-to-b from-white/70 to-rose-100/40 shrink-0 transform translate-y-3" />
          <div className="w-[480px] h-32 rounded-full bg-linear-to-b from-amber-50/80 to-pink-200/40 shrink-0 -ml-16 transform -translate-y-2" />
          <div className="w-[380px] h-26 rounded-full bg-linear-to-b from-white/75 to-purple-100/35 shrink-0 -ml-14 transform translate-y-4" />
          <div className="w-[500px] h-34 rounded-full bg-linear-to-b from-amber-100/70 to-rose-200/40 shrink-0 -ml-20 transform -translate-y-1" />
        </div>
      </div>

      {/* 5. Realistic Animated Meadow Landscape (Layered Wind-Swaying Grass & Flowers) */}
      <svg
        viewBox="0 0 800 480"
        className="absolute bottom-0 left-0 right-0 w-full h-[38vh] min-h-[250px] overflow-visible pointer-events-none z-10"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="meadowHaze" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4d7c2a" stopOpacity="0" />
            <stop offset="40%" stopColor="#3d6820" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1e3510" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="grassBladeDeep" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#84cc16" />
            <stop offset="50%" stopColor="#3f6212" />
            <stop offset="100%" stopColor="#1a2e05" />
          </linearGradient>

          <linearGradient id="grassBladeFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a3e635" />
            <stop offset="45%" stopColor="#65a30d" />
            <stop offset="100%" stopColor="#1e3a0a" />
          </linearGradient>

          <linearGradient id="stemWood" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a3e635" />
            <stop offset="60%" stopColor="#4d7c0f" />
            <stop offset="100%" stopColor="#142606" />
          </linearGradient>

          <linearGradient id="cosmosPink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="70%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#9f1239" />
          </linearGradient>

          <linearGradient id="cosmosLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="80%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
        </defs>

        {/* Ambient Dark Bottom Meadow Haze */}
        <rect x="0" y="160" width="800" height="320" fill="url(#meadowHaze)" />

        {/* --- LAYER 1: Deep Background Grass (Slow Sway) --- */}
        <g id="layer-grass-back" className="animate-sway-grass-3 opacity-75">
          {Array.from({ length: 26 }).map((_, i) => {
            const x = i * 32 + 8;
            const height = 240 + (i % 7) * 15;
            const curve = (i % 2 === 0 ? 1 : -1) * 25;
            return (
              <path
                key={`deep-grass-${i}`}
                d={`M ${x} 480 Q ${x + curve * 0.7} ${480 - height * 0.6} ${x + curve * 1.4} ${480 - height}`}
                stroke="url(#grassBladeDeep)"
                strokeWidth={i % 2 === 0 ? 3 : 2}
                strokeLinecap="round"
                fill="none"
              />
            );
          })}
        </g>

        {/* --- LAYER 2: Midground Grass & Meadow Wildflowers (Harmonic Wind Sway) --- */}
        <g id="layer-grass-mid" className="animate-sway-grass-1 opacity-90">
          {Array.from({ length: 22 }).map((_, i) => {
            const x = i * 38 + 15;
            const height = 260 + (i % 5) * 18;
            const curve = (i % 3 === 0 ? -1 : 1) * 30;
            return (
              <g key={`mid-grass-stalk-${i}`}>
                <path
                  d={`M ${x} 480 Q ${x + curve * 0.6} ${480 - height * 0.55} ${x + curve * 1.3} ${480 - height}`}
                  stroke="url(#grassBladeFront)"
                  strokeWidth={2.8}
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Feathery wheat/grass seed plume on every few stalks */}
                {i % 4 === 0 && (
                  <ellipse
                    cx={x + curve * 1.3}
                    cy={480 - height}
                    rx={3}
                    ry={9}
                    fill="#fef08a"
                    opacity="0.8"
                    transform={`rotate(${curve > 0 ? 15 : -15} ${x + curve * 1.3} ${480 - height})`}
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* --- LAYER 3: Swaying Background Wildflowers (Wind Sway Flower 1) --- */}
        {/* Flower A: Left Daisy (Sways with wind) */}
        <g transform="translate(90, 480)" className="animate-sway-flower-1 origin-bottom">
          <g transform="translate(0, -90) scale(1.15)">
            {/* Flower Stem */}
            <path d="M 0 90 Q 5 45 0 0" stroke="url(#stemWood)" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            {/* Daisy Petals */}
            {Array.from({ length: 13 }).map((_, i) => (
              <ellipse
                key={`daisy-left-${i}`}
                cx="0"
                cy="-19"
                rx="4.2"
                ry="11"
                fill="#ffffff"
                opacity="0.96"
                transform={`rotate(${(i * 360) / 13})`}
              />
            ))}
            <circle cx="0" cy="0" r="7.5" fill="#f59e0b" />
            <circle cx="-1.5" cy="-1.5" r="3.2" fill="#fef08a" />
          </g>
        </g>

        {/* Flower B: Left Cosmos (Magenta-Pink, sways gracefully in wind) */}
        <g transform="translate(180, 480)" className="animate-sway-flower-2 origin-bottom">
          <g transform="translate(0, -65) scale(0.95)">
            <path d="M 0 65 Q -8 30 0 0" stroke="url(#stemWood)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {Array.from({ length: 8 }).map((_, i) => (
              <path
                key={`cosmos-left-${i}`}
                d="M 0 0 C -6 -12 -10 -25 0 -28 C 10 -25 6 -12 0 0 Z"
                fill="url(#cosmosPink)"
                opacity="0.92"
                transform={`rotate(${(i * 360) / 8 + 12})`}
              />
            ))}
            <circle cx="0" cy="0" r="5.5" fill="#facc15" />
          </g>
        </g>

        {/* Flower C: Right Daisy (White with golden center) */}
        <g transform="translate(680, 480)" className="animate-sway-flower-1 origin-bottom">
          <g transform="translate(0, -85) scale(1.1)">
            <path d="M 0 85 Q -6 40 0 0" stroke="url(#stemWood)" strokeWidth="3" fill="none" strokeLinecap="round" />
            {Array.from({ length: 12 }).map((_, i) => (
              <ellipse
                key={`daisy-right-${i}`}
                cx="0"
                cy="-18"
                rx="4"
                ry="11"
                fill="#ffffff"
                opacity="0.95"
                transform={`rotate(${(i * 360) / 12})`}
              />
            ))}
            <circle cx="0" cy="0" r="7" fill="#f59e0b" />
            <circle cx="-1" cy="-1" r="3" fill="#fde047" />
          </g>
        </g>

        {/* Flower D: Right Cosmos (Light rose pink, dancing in breeze) */}
        <g transform="translate(735, 480)" className="animate-sway-flower-2 origin-bottom">
          <g transform="translate(0, -115) scale(1.2)">
            <path d="M 0 115 Q 10 55 0 0" stroke="url(#stemWood)" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            {Array.from({ length: 8 }).map((_, i) => (
              <path
                key={`cosmos-right-${i}`}
                d="M 0 0 C -6 -13 -10 -26 0 -29 C 10 -26 6 -13 0 0 Z"
                fill="url(#cosmosLight)"
                opacity="0.94"
                transform={`rotate(${(i * 360) / 8})`}
              />
            ))}
            <circle cx="0" cy="0" r="6" fill="#eab308" />
          </g>
        </g>

        {/* Flower E: Far Left Pink Cosmos */}
        <g transform="translate(35, 480)" className="animate-sway-flower-2 origin-bottom">
          <g transform="translate(0, -95) scale(0.9)">
            <path d="M 0 95 Q 6 45 0 0" stroke="url(#stemWood)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {Array.from({ length: 8 }).map((_, i) => (
              <path
                key={`cosmos-far-left-${i}`}
                d="M 0 0 C -5 -11 -9 -23 0 -25 C 9 -23 5 -11 0 0 Z"
                fill="url(#cosmosPink)"
                opacity="0.9"
                transform={`rotate(${(i * 360) / 8 + 20})`}
              />
            ))}
            <circle cx="0" cy="0" r="5" fill="#facc15" />
          </g>
        </g>

        {/* --- LAYER 4: Foreground Realistic Grass Blades with Dew (Fast Wind Sway) --- */}
        <g id="layer-grass-front" className="animate-sway-grass-2">
          {Array.from({ length: 28 }).map((_, i) => {
            const x = i * 29 + 5;
            const height = 180 + (i % 6) * 16;
            const curve = (i % 2 === 0 ? 1 : -1) * 22;
            return (
              <g key={`front-blade-${i}`}>
                <path
                  d={`M ${x} 480 Q ${x + curve * 0.5} ${480 - height * 0.5} ${x + curve * 1.2} ${480 - height}`}
                  stroke="url(#grassBladeFront)"
                  strokeWidth={i % 3 === 0 ? 3.5 : 2.6}
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Glistening morning dewdrop on tip */}
                {i % 3 === 0 && (
                  <circle
                    cx={x + curve * 1.2}
                    cy={480 - height + 1}
                    r={2.4}
                    fill="#ffffff"
                    opacity="0.85"
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
