import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MOODS } from '../constants/moods';
import { MoodEntry, MoodType } from '../types';
import { FlowerIcon } from './FlowerIcon';
import { LittleCenterMoth, LunaMoth, PolyphemusMoth } from './MothGraphics';

interface DahliaFlowerProps {
  daysInMonth: number;
  entries: Record<number, MoodEntry>;
  selectedDay: number | null;
  onSelectDay: (day: number | null) => void;
  onSaveMood?: (day: number, mood: MoodType) => void;
  onDeleteMood?: (day: number) => void;
  scale?: number;
}

interface PetalDefinition {
  day: number;
  layer: number; // 0: innermost, 1: mid-inner, 2: mid-outer, 3: outer
  angle: number; // angle in degrees
  radius: number; // distance from center in svg units
  width: number;
  height: number;
  rotationOffset?: number;
}

// Phyllotaxis-based concentric petal layout
function generatePetalLayout(daysInMonth: number): PetalDefinition[] {
  const petals: PetalDefinition[] = [];

  // Inner ring: days 1 to 5 (5 petals tightly surrounding florets)
  const innerCount = Math.min(5, daysInMonth);
  for (let i = 0; i < innerCount; i++) {
    const angle = (i * 360) / innerCount - 25;
    petals.push({
      day: i + 1,
      layer: 0,
      angle,
      radius: 46,
      width: 42,
      height: 70,
    });
  }

  // Mid-inner ring: days 6 to 12 (7 petals)
  const midInnerCount = Math.min(7, Math.max(0, daysInMonth - 5));
  for (let i = 0; i < midInnerCount; i++) {
    const angle = (i * 360) / 7 + 15;
    petals.push({
      day: 5 + i + 1,
      layer: 1,
      angle,
      radius: 76,
      width: 50,
      height: 84,
    });
  }

  // Mid-outer ring: days 13 to 21 (9 petals)
  const midOuterCount = Math.min(9, Math.max(0, daysInMonth - 12));
  for (let i = 0; i < midOuterCount; i++) {
    const angle = (i * 360) / 9 - 10;
    petals.push({
      day: 12 + i + 1,
      layer: 2,
      angle,
      radius: 110,
      width: 56,
      height: 98,
    });
  }

  // Outer ring: days 22 to 31 (10 petals)
  const outerCount = Math.max(0, daysInMonth - 21);
  for (let i = 0; i < outerCount; i++) {
    const angle = (i * 360) / outerCount + 12;
    petals.push({
      day: 21 + i + 1,
      layer: 3,
      angle,
      radius: 146,
      width: 62,
      height: 114,
    });
  }

  return petals;
}

export const DahliaFlower: React.FC<DahliaFlowerProps> = ({
  daysInMonth,
  entries,
  selectedDay,
  onSelectDay,
  onSaveMood,
  onDeleteMood,
  scale = 1,
}) => {
  const petals = useMemo(() => generatePetalLayout(daysInMonth), [daysInMonth]);

  // Group petals by layer so outer layers render first (back) and inner layers render last (top)
  const outerPetals = petals.filter((p) => p.layer === 3);
  const midOuterPetals = petals.filter((p) => p.layer === 2);
  const midInnerPetals = petals.filter((p) => p.layer === 1);
  const innerPetals = petals.filter((p) => p.layer === 0);

  const flowerWrapperRef = useRef<HTMLDivElement | null>(null);

  // Exact screen-space popover coordinates strictly clamped inside visible window
  const [popoverPos, setPopoverPos] = useState<{
    x: number;
    y: number;
    width: number;
    isAbove: boolean;
    arrowOffsetPx: number;
  } | null>(null);

  // Synchronous, ultra-fast popover position calculator
  const computePopoverForDay = useCallback(
    (day: number) => {
      if (!flowerWrapperRef.current) return null;

      const p = petals.find((item) => item.day === day);
      if (!p) return null;

      const rect = flowerWrapperRef.current.getBoundingClientRect();
      const flowerCenterX = rect.left + rect.width / 2;
      const flowerCenterY = rect.top + rect.height / 2;

      const rad = (p.angle * Math.PI) / 180;
      // p.radius is SVG coordinate units (0 to 250). In client px, flower radius is rect.width / 2
      const petalDistPx = (p.radius / 250) * (rect.width / 2);
      const petalScreenX = flowerCenterX + petalDistPx * Math.sin(rad);
      const petalScreenY = flowerCenterY - petalDistPx * Math.cos(rad);

      // Responsive popover width: fits comfortably on small phones up to desktop
      const popoverWidth = Math.min(315, window.innerWidth - 20);
      const popoverHeight = 52;

      // Horizontal clamping: strictly inside [10px, window.innerWidth - popoverWidth - 10px]
      let posX = petalScreenX - popoverWidth / 2;
      posX = Math.max(10, Math.min(window.innerWidth - popoverWidth - 10, posX));

      // Arrow offset relative to popover left edge
      const arrowOffsetPx = Math.max(18, Math.min(popoverWidth - 18, petalScreenX - posX));

      // Vertical boundary clearance:
      // Top boundary: clear TopBar & MoodBar (~96px)
      // Bottom boundary: clear BottomBar (~window.innerHeight - 76px)
      const minTop = 96;
      const maxTop = window.innerHeight - 76 - popoverHeight;

      // Determine whether to place above or below the petal
      const preferAbove = petalScreenY >= flowerCenterY;
      const spacing = 26;

      let targetY = preferAbove ? petalScreenY - popoverHeight - spacing : petalScreenY + spacing;
      let isAbove = preferAbove;

      if (targetY < minTop) {
        if (preferAbove && petalScreenY + spacing <= maxTop) {
          targetY = petalScreenY + spacing;
          isAbove = false;
        } else {
          targetY = minTop;
        }
      } else if (targetY > maxTop) {
        if (!preferAbove && petalScreenY - popoverHeight - spacing >= minTop) {
          targetY = petalScreenY - popoverHeight - spacing;
          isAbove = true;
        } else {
          targetY = maxTop;
        }
      }

      return {
        x: Math.round(posX),
        y: Math.round(targetY),
        width: popoverWidth,
        isAbove,
        arrowOffsetPx: Math.round(arrowOffsetPx),
      };
    },
    [petals]
  );

  // Instant 0ms petal select handler
  const handlePetalSelect = useCallback(
    (day: number) => {
      const nextDay = selectedDay === day ? null : day;
      onSelectDay(nextDay);
      if (nextDay !== null) {
        const pos = computePopoverForDay(nextDay);
        if (pos) {
          setPopoverPos(pos);
        }
      } else {
        setPopoverPos(null);
      }
    },
    [selectedDay, onSelectDay, computePopoverForDay]
  );

  const updatePopoverPosition = useCallback(() => {
    if (selectedDay === null) {
      setPopoverPos(null);
      return;
    }
    const pos = computePopoverForDay(selectedDay);
    if (pos) setPopoverPos(pos);
  }, [selectedDay, computePopoverForDay]);

  useEffect(() => {
    updatePopoverPosition();
    window.addEventListener('resize', updatePopoverPosition, { passive: true });
    window.addEventListener('scroll', updatePopoverPosition, { passive: true });
    return () => {
      window.removeEventListener('resize', updatePopoverPosition);
      window.removeEventListener('scroll', updatePopoverPosition);
    };
  }, [updatePopoverPosition, scale]);

  // Render an individual natural petal shape with organic pointed tip and rounded shoulders
  const renderPetal = (petal: PetalDefinition) => {
    const entry = entries[petal.day];
    const isSelected = selectedDay === petal.day;

    let fillId = 'url(#unloggedPetal)';
    let strokeColor = '#f3cfd9';
    let textColor = '#8a6575';

    if (entry) {
      if (entry.mood === 'happy') {
        fillId = 'url(#happyPetal)';
        strokeColor = '#e11d48';
        textColor = '#ffffff';
      } else if (entry.mood === 'neutral') {
        fillId = 'url(#neutralPetal)';
        strokeColor = '#d97706';
        textColor = '#ffffff';
      } else if (entry.mood === 'sad') {
        fillId = 'url(#sadPetal)';
        strokeColor = '#7c3aed';
        textColor = '#ffffff';
      }
    }

    // Compute transformation
    const rad = (petal.angle * Math.PI) / 180;
    const cx = 250 + petal.radius * Math.sin(rad);
    const cy = 250 - petal.radius * Math.cos(rad);
    const rotation = petal.angle + (petal.rotationOffset || 0);

    return (
      <g
        key={`petal-${petal.day}`}
        transform={`translate(${cx}, ${cy}) rotate(${rotation})`}
        className="cursor-pointer group select-none"
        style={{ touchAction: 'manipulation' }}
        onPointerDown={(e) => {
          e.stopPropagation();
          handlePetalSelect(petal.day);
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Generous transparent hit-target for instant tap responsiveness */}
        <ellipse
          cx="0"
          cy="0"
          rx={petal.width * 0.65}
          ry={petal.height * 0.6}
          fill="transparent"
          pointerEvents="all"
        />

        {/* Glow halo when active/selected */}
        {isSelected && (
          <ellipse
            cx="0"
            cy="0"
            rx={petal.width * 0.62}
            ry={petal.height * 0.58}
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            className="filter drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse"
          />
        )}

        {/* Petal Outer Drop Shadow */}
        <path
          d={`M 0 ${-petal.height * 0.52} 
              C ${petal.width * 0.44} ${-petal.height * 0.35}, ${petal.width * 0.56} ${petal.height * 0.15}, 0 ${petal.height * 0.52}
              C ${-petal.width * 0.56} ${petal.height * 0.15}, ${-petal.width * 0.44} ${-petal.height * 0.35}, 0 ${-petal.height * 0.52} Z`}
          fill="rgba(40, 15, 25, 0.15)"
          transform="translate(1, 3)"
        />

        {/* Main Petal Body */}
        <path
          d={`M 0 ${-petal.height * 0.52} 
              C ${petal.width * 0.44} ${-petal.height * 0.35}, ${petal.width * 0.56} ${petal.height * 0.15}, 0 ${petal.height * 0.52}
              C ${-petal.width * 0.56} ${petal.height * 0.15}, ${-petal.width * 0.44} ${-petal.height * 0.35}, 0 ${-petal.height * 0.52} Z`}
          fill={fillId}
          stroke={strokeColor}
          strokeWidth={isSelected ? '2.4' : '1.2'}
          className="transition-colors duration-300 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] group-hover:brightness-105"
        />

        {/* Delicate inner petal central vein */}
        <path
          d={`M 0 ${-petal.height * 0.4} Q 0 0 0 ${petal.height * 0.4}`}
          stroke={entry ? 'rgba(255,255,255,0.45)' : 'rgba(235, 180, 195, 0.45)'}
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Petal Day Number Badge */}
        <g transform={`rotate(${-rotation})`}>
          <circle
            cx="0"
            cy="0"
            r={petal.layer === 0 ? 10 : petal.layer === 1 ? 11 : 12}
            fill={entry ? 'rgba(0, 0, 0, 0.22)' : 'rgba(255, 255, 255, 0.75)'}
            className="backdrop-blur-xs"
          />
          <text
            x="0"
            y={petal.layer === 0 ? '3.5' : '4'}
            textAnchor="middle"
            fill={textColor}
            fontSize={petal.layer === 0 ? '11' : petal.layer === 1 ? '12' : '13'}
            fontWeight="bold"
            fontFamily="'Cinzel Decorative', 'Playfair Display', serif"
            className="select-none pointer-events-none"
            style={{
              textShadow: entry ? '0 1px 2px rgba(0,0,0,0.5)' : '0 1px 1px rgba(255,255,255,0.9)',
            }}
          >
            {petal.day}
          </text>
        </g>
      </g>
    );
  };

  return (
    <div
      className="relative flex items-center justify-center w-full h-full select-none"
      onClick={() => onSelectDay(null)}
    >
      {/* Centered Scalable Flower Wrapper */}
      <div
        ref={flowerWrapperRef}
        className="relative flex items-center justify-center w-[min(90vw,54vh,460px)] h-[min(90vw,54vh,460px)] aspect-square transition-transform duration-200"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full overflow-visible pointer-events-auto"
        >
          <defs>
            {/* Default Unlogged Petal */}
            <linearGradient id="unloggedPetal" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff9fa" />
              <stop offset="35%" stopColor="#fff0f4" />
              <stop offset="85%" stopColor="#fce4ec" />
              <stop offset="100%" stopColor="#f8bbd0" />
            </linearGradient>

            {/* Happy Mood Petal: Rich Coral / Red Dahlia */}
            <linearGradient id="happyPetal" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff7b89" />
              <stop offset="25%" stopColor="#f43f5e" />
              <stop offset="70%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#9f1239" />
            </linearGradient>

            {/* Neutral Mood Petal: Warm Sunflower / Amber Dahlia */}
            <linearGradient id="neutralPetal" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="75%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>

            {/* Sad/Tired Mood Petal: Lavender / Purple Dahlia */}
            <linearGradient id="sadPetal" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e9d5ff" />
              <stop offset="30%" stopColor="#c084fc" />
              <stop offset="70%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#581c87" />
            </linearGradient>

            {/* Central Dahlia Stem */}
            <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2e5a1c" />
              <stop offset="45%" stopColor="#4d7c0f" />
              <stop offset="75%" stopColor="#65a30d" />
              <stop offset="100%" stopColor="#1e3a0a" />
            </linearGradient>

            {/* Leaf Gradient */}
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="60%" stopColor="#4d7c0f" />
              <stop offset="100%" stopColor="#1e3a0a" />
            </linearGradient>

            {/* Watercolor Splash Ribbon Gradient */}
            <linearGradient id="watercolorSplash" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.88" />
              <stop offset="50%" stopColor="#fb7185" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#fda4af" stopOpacity="0" />
            </linearGradient>

            {/* Gold Center Florets */}
            <radialGradient id="floretGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="85%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>
          </defs>

          {/* --- 1. BOTANICAL STEM & LEAVES (Behind flower) --- */}
          <path
            d="M 250 250 Q 248 370 253 520"
            stroke="url(#stemGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
          />

          {/* Left Dahlia Leaf */}
          <path
            d="M 248 340 C 200 330 160 370 145 410 C 185 415 220 385 249 355 Z"
            fill="url(#leafGrad)"
            stroke="#365314"
            strokeWidth="1.5"
            className="filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)]"
          />

          {/* Right Dahlia Leaf */}
          <path
            d="M 252 380 C 300 370 340 405 355 450 C 315 455 280 425 251 395 Z"
            fill="url(#leafGrad)"
            stroke="#365314"
            strokeWidth="1.5"
            className="filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)]"
          />

          {/* --- 2. CONCENTRIC PETAL LAYERS --- */}
          {/* Layer 3: Outer Ring */}
          <g id="layer-outer">{outerPetals.map(renderPetal)}</g>

          {/* Layer 2: Mid-Outer Ring */}
          <g id="layer-mid-outer">{midOuterPetals.map(renderPetal)}</g>

          {/* Layer 1: Mid-Inner Ring */}
          <g id="layer-mid-inner">{midInnerPetals.map(renderPetal)}</g>

          {/* Layer 0: Inner Ring */}
          <g id="layer-inner">{innerPetals.map(renderPetal)}</g>

          {/* --- 3. CENTER DAHLIA DISK FLORETS --- */}
          <g id="center-disk" className="cursor-pointer">
            <circle
              cx="250"
              cy="250"
              r="26"
              fill="url(#floretGlow)"
              stroke="#78350f"
              strokeWidth="2.5"
              className="filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            />
            {Array.from({ length: 18 }).map((_, i) => {
              const fRad = (i * 20 * Math.PI) / 180;
              const fx = 250 + 13 * Math.cos(fRad);
              const fy = 250 + 13 * Math.sin(fRad);
              return <circle key={`floret-outer-${i}`} cx={fx} cy={fy} r="2.8" fill="#fef08a" opacity="0.95" />;
            })}
            {Array.from({ length: 9 }).map((_, i) => {
              const fRad = (i * 40 * Math.PI) / 180;
              const fx = 250 + 6 * Math.cos(fRad);
              const fy = 250 + 6 * Math.sin(fRad);
              return <circle key={`floret-inner-${i}`} cx={fx} cy={fy} r="2.2" fill="#fffbeb" />;
            })}
          </g>

          {/* --- 4. WATERCOLOR SPLASH RIBBON ON ACTIVE PETAL --- */}
          {selectedDay === 15 && (
            <g id="watercolor-splash-ribbon" className="pointer-events-none animate-fadeIn">
              <path
                d="M 235 250 C 265 295 315 330 335 375 C 310 365 260 335 235 285 Z"
                fill="url(#watercolorSplash)"
                className="filter blur-[1px]"
              />
              <circle cx="342" cy="384" r="5" fill="#f43f5e" opacity="0.75" />
              <circle cx="355" cy="372" r="3.2" fill="#fb7185" opacity="0.65" />
              <circle cx="330" cy="398" r="3.8" fill="#fda4af" opacity="0.8" />
              <circle cx="348" cy="408" r="2.2" fill="#f43f5e" opacity="0.7" />
            </g>
          )}
        </svg>

        {/* --- 5. ANIMATED BUTTERFLIES / MOTHS AROUND FLOWER --- */}
        <PolyphemusMoth className="absolute top-[8%] left-[16%] w-24 sm:w-28 h-20 sm:h-24 z-20 animate-butterfly-1 pointer-events-none" />
        <LunaMoth className="absolute top-[6%] right-[14%] w-22 sm:w-26 h-20 sm:h-24 z-20 animate-butterfly-2 pointer-events-none" />
        <LittleCenterMoth className="absolute top-[42%] left-[34%] w-14 sm:w-16 h-12 sm:h-14 z-30 animate-butterfly-center pointer-events-none" />
        <PolyphemusMoth size="large" className="absolute bottom-[28%] left-[15%] w-32 sm:w-36 h-26 sm:h-30 z-20 animate-butterfly-large pointer-events-none" />
      </div>

      {/* --- 6. VIEWPORT-CLAMPED MOOD SELECTION POPOVER --- */}
      {/* Positioned in fixed screen coordinates outside zoom transform so it never clips! */}
      {selectedDay !== null && popoverPos && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 pointer-events-auto flex flex-col items-center drop-shadow-2xl select-none transition-opacity duration-100"
          style={{
            left: `${popoverPos.x}px`,
            top: `${popoverPos.y}px`,
            width: `${popoverPos.width}px`,
          }}
        >
          {/* For dropdown (when positioned below petal), arrow notch points UP */}
          {!popoverPos.isAbove && (
            <div
              className="w-0 h-0 border-x-[7px] border-x-transparent border-b-[8px] border-b-white/95 filter drop-shadow-[0_-2px_2px_rgba(0,0,0,0.06)] mb-[-1px] self-start"
              style={{
                marginLeft: `${popoverPos.arrowOffsetPx}px`,
                transform: 'translateX(-50%)',
              }}
            />
          )}

          {/* Main Capsule Glass Panel */}
          <div className="glass-panel w-full px-2.5 py-1.5 rounded-2xl bg-white/95 text-stone-800 shadow-2xl border border-white/80 flex items-center justify-between space-x-1.5 select-none">
            {/* Day indicator badge */}
            <span className="font-botanical font-bold text-xs px-2 py-1 rounded-lg bg-stone-100 text-stone-700 shrink-0">
              Day {selectedDay}
            </span>

            {/* 3 Compact Mood Buttons with instant 0ms touch response */}
            <div className="flex items-center space-x-1">
              {(['happy', 'neutral', 'sad'] as MoodType[]).map((m) => {
                const cfg = MOODS[m];
                const isCurrent = entries[selectedDay]?.mood === m;
                return (
                  <button
                    key={m}
                    type="button"
                    style={{ touchAction: 'manipulation' }}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      if (onSaveMood) {
                        onSaveMood(selectedDay, m);
                      }
                      onSelectDay(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={`flex items-center space-x-1 px-2 py-1.5 rounded-xl border transition-transform cursor-pointer active:scale-95 ${
                      isCurrent
                        ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/50 shadow-xs'
                        : 'bg-white hover:bg-stone-50 border-stone-200/80 shadow-xs'
                    }`}
                    title={`Log ${cfg.label}`}
                  >
                    <FlowerIcon mood={m} size={20} />
                    <span
                      className="font-script text-base sm:text-lg font-bold leading-none"
                      style={{ color: cfg.textColor }}
                    >
                      {cfg.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Clear button if petal is already logged */}
            {entries[selectedDay] && onDeleteMood && (
              <button
                type="button"
                style={{ touchAction: 'manipulation' }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onDeleteMood(selectedDay);
                  onSelectDay(null);
                }}
                onClick={(e) => e.stopPropagation()}
                className="px-1.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Clear Petal"
              >
                Clear
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              style={{ touchAction: 'manipulation' }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onSelectDay(null);
              }}
              onClick={(e) => e.stopPropagation()}
              aria-label="Close"
              className="w-5 h-5 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 text-xs transition-colors cursor-pointer shrink-0"
            >
              ✕
            </button>
          </div>

          {/* For dropup (when positioned above petal), arrow notch points DOWN */}
          {popoverPos.isAbove && (
            <div
              className="w-0 h-0 border-x-[7px] border-x-transparent border-t-[8px] border-t-white/95 filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.06)] mt-[-1px] self-start"
              style={{
                marginLeft: `${popoverPos.arrowOffsetPx}px`,
                transform: 'translateX(-50%)',
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
