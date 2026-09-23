import React from 'react';
import { MOODS } from '../constants/moods';
import { MoodStats, MoodType } from '../types';
import { FlowerIcon } from './FlowerIcon';

interface MoodBarProps {
  stats: MoodStats;
  quickPaintMood: MoodType | null;
  onSetQuickPaintMood: (mood: MoodType | null) => void;
}

export const MoodBar: React.FC<MoodBarProps> = ({
  stats,
  quickPaintMood,
  onSetQuickPaintMood,
}) => {
  const moodList: { type: MoodType; label: string; count: number }[] = [
    { type: 'happy', label: 'Happy', count: stats.happyCount },
    { type: 'neutral', label: 'Neutral', count: stats.neutralCount },
    { type: 'sad', label: 'Sad/Tired', count: stats.sadCount },
  ];

  return (
    <div className="relative z-30 flex flex-col items-center justify-center w-full px-2 py-1 sm:px-6 sm:py-1.5 shrink-0">
      <div className="flex items-center space-x-1.5 sm:space-x-3 max-w-md w-full justify-center">
        {moodList.map((item) => {
          const config = MOODS[item.type];
          const isPaintActive = quickPaintMood === item.type;

          return (
            <button
              key={item.type}
              type="button"
              onClick={() => {
                // Toggle paint mode
                onSetQuickPaintMood(isPaintActive ? null : item.type);
              }}
              className={`glass-pill relative flex items-center justify-center space-x-1.5 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full cursor-pointer transition-all duration-200 select-none ${
                isPaintActive
                  ? 'ring-2 ring-white/95 scale-105 shadow-[0_6px_24px_rgba(255,255,255,0.6)] bg-white/45'
                  : 'hover:scale-[1.03]'
              }`}
              title={`Tap to paint ${config.label}`}
            >
              {/* Miniature Flower Icon */}
              <div className="shrink-0 transition-transform group-hover:rotate-12">
                <FlowerIcon mood={item.type} size={20} />
              </div>

              {/* Mood Label in Elegant Cursive Script */}
              <span
                className="font-script text-lg sm:text-2xl leading-none pt-0.5 text-stone-800 font-semibold"
                style={{
                  color: item.type === 'happy' ? '#5a1926' : item.type === 'neutral' ? '#593902' : '#451a5e',
                  textShadow: '0 1px 1px rgba(255,255,255,0.8)',
                }}
              >
                {item.label}
              </span>

              {/* Count indicator bubble */}
              {item.count > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[9px] sm:text-[11px] font-medium rounded-full bg-white/70 text-stone-700 shadow-xs">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Helpful subtle indicator when a mood is selected for direct painting */}
      {quickPaintMood && (
        <div className="mt-1 text-[10px] sm:text-[11px] font-medium text-stone-800 bg-white/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/60 shadow-xs animate-fadeIn text-center">
          Tap any petal to bloom as <strong className="font-semibold">{MOODS[quickPaintMood].label}</strong> (tap again to exit)
        </div>
      )}
    </div>
  );
};
