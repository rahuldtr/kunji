import React from 'react';

interface MothProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

// Mint Green Luna Moth (Top Right)
export const LunaMoth: React.FC<MothProps> = ({ className = '', style, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`relative select-none pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-105 ${className}`}
      title="Luna Moth (Actias luna)"
    >
      <svg
        viewBox="0 0 160 140"
        className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
      >
        <defs>
          <linearGradient id="lunaWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bbf2c8" />
            <stop offset="45%" stopColor="#8be2a3" />
            <stop offset="85%" stopColor="#66cc84" />
            <stop offset="100%" stopColor="#52b870" />
          </linearGradient>
          <linearGradient id="lunaBorder" x1="0%" y1="0%" x2="100%" y2="20%">
            <stop offset="0%" stopColor="#6b2b40" />
            <stop offset="100%" stopColor="#9a4d64" />
          </linearGradient>
        </defs>

        {/* Body and head */}
        <g id="body">
          {/* Feathered Antennae */}
          <path d="M 78 52 Q 72 40 68 32 Q 71 35 76 48" stroke="#fef3c7" strokeWidth="1.5" fill="none" />
          <path d="M 82 52 Q 88 40 92 32 Q 89 35 84 48" stroke="#fef3c7" strokeWidth="1.5" fill="none" />
          {/* Fluffy white thorax */}
          <ellipse cx="80" cy="56" rx="6" ry="10" fill="#fdfbf7" />
          {/* Abdomen */}
          <ellipse cx="80" cy="74" rx="5" ry="12" fill="#e2f5e8" stroke="#a7deb8" strokeWidth="1" />
          {/* Eyes */}
          <circle cx="76" cy="52" r="1.5" fill="#451a03" />
          <circle cx="84" cy="52" r="1.5" fill="#451a03" />
        </g>

        {/* Left Forewing */}
        <g className="origin-[80px_55px] animate-flutter-left">
          <path
            d="M 77 55 C 60 40 30 25 15 28 C 10 30 18 55 25 72 C 35 90 65 85 75 65 Z"
            fill="url(#lunaWingGrad)"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="0.8"
          />
          {/* Leading edge purple-brown costal margin */}
          <path
            d="M 77 55 C 60 40 30 25 15 28 C 17 31 35 44 76 56 Z"
            fill="url(#lunaBorder)"
          />
          {/* Wing veins */}
          <path d="M 70 56 Q 45 48 24 45" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" fill="none" />
          <path d="M 70 58 Q 50 65 32 68" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" fill="none" />
          {/* Eye spot */}
          <circle cx="45" cy="52" r="4.5" fill="#fdf2f8" stroke="#be185d" strokeWidth="1" />
          <circle cx="45" cy="52" r="2.5" fill="#fef08a" />
          <circle cx="46" cy="52" r="1.2" fill="#1e1b4b" />
          {/* Left Hindwing & Elegant Long Tail */}
          <path
            d="M 75 66 C 60 75 45 88 40 102 C 37 110 36 122 34 136 C 36 135 44 118 48 108 C 55 92 68 85 76 72 Z"
            fill="url(#lunaWingGrad)"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="0.8"
          />
        </g>

        {/* Right Forewing */}
        <g className="origin-[80px_55px] animate-flutter-right">
          <path
            d="M 83 55 C 100 40 130 25 145 28 C 150 30 142 55 135 72 C 125 90 95 85 85 65 Z"
            fill="url(#lunaWingGrad)"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="0.8"
          />
          <path
            d="M 83 55 C 100 40 130 25 145 28 C 143 31 125 44 84 56 Z"
            fill="url(#lunaBorder)"
          />
          <path d="M 90 56 Q 115 48 136 45" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" fill="none" />
          <path d="M 90 58 Q 110 65 128 68" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" fill="none" />
          <circle cx="115" cy="52" r="4.5" fill="#fdf2f8" stroke="#be185d" strokeWidth="1" />
          <circle cx="115" cy="52" r="2.5" fill="#fef08a" />
          <circle cx="114" cy="52" r="1.2" fill="#1e1b4b" />
          {/* Right Hindwing & Long Tail */}
          <path
            d="M 85 66 C 100 75 115 88 120 102 C 123 110 124 122 126 136 C 124 135 116 118 112 108 C 105 92 92 85 84 72 Z"
            fill="url(#lunaWingGrad)"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="0.8"
          />
        </g>
      </svg>
    </div>
  );
};

// Warm Brown Cecropia / Polyphemus Moth with Eyespots
export const PolyphemusMoth: React.FC<MothProps & { size?: 'small' | 'large' }> = ({
  className = '',
  style,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`relative select-none pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-105 ${className}`}
      title="Polyphemus Moth (Antheraea polyphemus)"
    >
      <svg
        viewBox="0 0 200 160"
        className="w-full h-full filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
      >
        <defs>
          <linearGradient id="polyWingBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c5986e" />
            <stop offset="40%" stopColor="#9e6c46" />
            <stop offset="80%" stopColor="#7a4e32" />
            <stop offset="100%" stopColor="#56331d" />
          </linearGradient>
          <linearGradient id="polyHindBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d8ab7f" />
            <stop offset="60%" stopColor="#8e5a38" />
            <stop offset="100%" stopColor="#4e2c17" />
          </linearGradient>
        </defs>

        {/* Left Forewing */}
        <g className="origin-[100px_70px] animate-flutter-left">
          <path
            d="M 96 68 C 75 45 40 20 18 24 C 6 27 12 60 22 80 C 35 105 75 95 94 80 Z"
            fill="url(#polyWingBg)"
            stroke="#e8d5be"
            strokeWidth="1.2"
          />
          {/* Submarginal decorative wavy lines */}
          <path d="M 22 34 Q 30 65 38 90" stroke="#f5e6d3" strokeWidth="1.5" strokeDasharray="3 2" fill="none" opacity="0.8" />
          <path d="M 28 38 Q 36 68 44 92" stroke="#281308" strokeWidth="1" fill="none" opacity="0.6" />
          {/* Left Wing Small eyespot */}
          <circle cx="55" cy="54" r="5" fill="#fdfbf7" stroke="#241107" strokeWidth="1.5" />
          <circle cx="55" cy="54" r="2.5" fill="#b45309" />
          {/* Left Hindwing with giant dramatic eyespot */}
          <path
            d="M 94 80 C 75 92 45 110 52 135 C 58 148 85 145 100 120 Z"
            fill="url(#polyHindBg)"
            stroke="#d4a373"
            strokeWidth="1"
          />
          {/* Giant Eyespot on Hindwing */}
          <circle cx="75" cy="116" r="13" fill="#1c1917" stroke="#fbbf24" strokeWidth="2.5" />
          <circle cx="75" cy="116" r="7.5" fill="#1e3a8a" />
          <ellipse cx="76" cy="115" rx="3.5" ry="4.5" fill="#93c5fd" />
          <circle cx="77" cy="114" r="1.5" fill="#ffffff" />
        </g>

        {/* Right Forewing */}
        <g className="origin-[100px_70px] animate-flutter-right">
          <path
            d="M 104 68 C 125 45 160 20 182 24 C 194 27 188 60 178 80 C 165 105 125 95 106 80 Z"
            fill="url(#polyWingBg)"
            stroke="#e8d5be"
            strokeWidth="1.2"
          />
          <path d="M 178 34 Q 170 65 162 90" stroke="#f5e6d3" strokeWidth="1.5" strokeDasharray="3 2" fill="none" opacity="0.8" />
          <path d="M 172 38 Q 164 68 156 92" stroke="#281308" strokeWidth="1" fill="none" opacity="0.6" />
          <circle cx="145" cy="54" r="5" fill="#fdfbf7" stroke="#241107" strokeWidth="1.5" />
          <circle cx="145" cy="54" r="2.5" fill="#b45309" />
          {/* Right Hindwing with giant dramatic eyespot */}
          <path
            d="M 106 80 C 125 92 155 110 148 135 C 142 148 115 145 100 120 Z"
            fill="url(#polyHindBg)"
            stroke="#d4a373"
            strokeWidth="1"
          />
          <circle cx="125" cy="116" r="13" fill="#1c1917" stroke="#fbbf24" strokeWidth="2.5" />
          <circle cx="125" cy="116" r="7.5" fill="#1e3a8a" />
          <ellipse cx="124" cy="115" rx="3.5" ry="4.5" fill="#93c5fd" />
          <circle cx="123" cy="114" r="1.5" fill="#ffffff" />
        </g>

        {/* Central Furry Body & Antennae */}
        <g id="polyBody">
          {/* Feathery Antennae */}
          <path d="M 97 60 Q 86 42 78 35 Q 85 45 95 56" stroke="#fcd34d" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M 103 60 Q 114 42 122 35 Q 115 45 105 56" stroke="#fcd34d" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          {/* Head & Collar */}
          <circle cx="100" cy="58" r="6" fill="#f5ede3" stroke="#854d0e" strokeWidth="1" />
          {/* Thorax (plump & hairy) */}
          <ellipse cx="100" cy="72" rx="8" ry="11" fill="#78350f" stroke="#d97706" strokeWidth="1" />
          {/* Abdomen with horizontal segments */}
          <ellipse cx="100" cy="94" rx="7" ry="14" fill="#92400e" />
          <line x1="94" y1="88" x2="106" y2="88" stroke="#fde68a" strokeWidth="1" />
          <line x1="93" y1="94" x2="107" y2="94" stroke="#fde68a" strokeWidth="1" />
          <line x1="94" y1="100" x2="106" y2="100" stroke="#fde68a" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
};

// Small center moth resting delicately on inner petals
export const LittleCenterMoth: React.FC<MothProps> = ({ className = '', style, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`relative select-none pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-110 ${className}`}
      title="Little Meadow Moth"
    >
      <svg
        viewBox="0 0 100 80"
        className="w-full h-full filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
      >
        <defs>
          <linearGradient id="centerMothWing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d6b998" />
            <stop offset="50%" stopColor="#ad8762" />
            <stop offset="100%" stopColor="#69482d" />
          </linearGradient>
        </defs>
        {/* Left wing */}
        <path
          d="M 50 35 C 38 20 18 16 10 25 C 6 30 15 50 26 58 C 38 65 48 50 50 42 Z"
          fill="url(#centerMothWing)"
          stroke="#fdf6ec"
          strokeWidth="0.8"
        />
        {/* Right wing */}
        <path
          d="M 50 35 C 62 20 82 16 90 25 C 94 30 85 50 74 58 C 62 65 52 50 50 42 Z"
          fill="url(#centerMothWing)"
          stroke="#fdf6ec"
          strokeWidth="0.8"
        />
        {/* Wing texture */}
        <path d="M 22 26 Q 30 40 40 46" stroke="#452712" strokeWidth="0.7" fill="none" opacity="0.6" />
        <path d="M 78 26 Q 70 40 60 46" stroke="#452712" strokeWidth="0.7" fill="none" opacity="0.6" />
        {/* Body */}
        <ellipse cx="50" cy="38" rx="3.5" ry="8" fill="#e5d0ba" />
        <ellipse cx="50" cy="48" rx="2.5" ry="9" fill="#583419" />
        {/* Antennae */}
        <path d="M 49 32 Q 42 22 36 18" stroke="#3b1d09" strokeWidth="1" fill="none" />
        <path d="M 51 32 Q 58 22 64 18" stroke="#3b1d09" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
};
