import React from 'react';
import { MONTH_NAMES } from '../constants/moods';

interface BottomBarProps {
  currentMonth: number; // 0-11
  currentYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onOpenMonthlyList: () => void;
  onOpenMonthPicker: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  currentMonth,
  currentYear,
  onPrevMonth,
  onNextMonth,
  onOpenMonthlyList,
  onOpenMonthPicker,
}) => {
  const monthName = MONTH_NAMES[currentMonth];

  return (
    <nav aria-label="Month navigation" className="relative z-30 flex items-center justify-between w-full px-3 pb-3 pt-1 sm:px-6 sm:pb-5 sm:pt-2 max-w-lg mx-auto shrink-0">
      {/* Left List / Record Toggle Button [ ≡ ] */}
      <button
        type="button"
        onClick={onOpenMonthlyList}
        aria-label="Open monthly records and journal"
        className="glass-btn flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl cursor-pointer text-white/95 hover:text-white shrink-0"
        title="View Monthly Journal"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Center Group: Prev Month Button, Month Pill, Next Month Button */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        {/* Previous Month Button [ < ] */}
        <button
          type="button"
          onClick={onPrevMonth}
          aria-label="Previous Month"
          className="glass-btn flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl cursor-pointer text-white/95 hover:text-white"
          title="Previous Month"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Center Month Pill [ October ] */}
        <button
          type="button"
          onClick={onOpenMonthPicker}
          aria-label={`Current month: ${monthName} ${currentYear}. Tap to change month.`}
          className="glass-pill flex items-center justify-center px-4 py-1.5 sm:px-8 sm:py-2.5 rounded-full cursor-pointer group shadow-lg min-w-[130px] sm:min-w-[170px]"
          title="Select Month"
        >
          <span
            className="font-script text-2xl sm:text-3xl text-stone-900 font-semibold tracking-wide transition-transform group-hover:scale-105"
            style={{
              textShadow: '0 1px 2px rgba(255,255,255,0.9), 0 0 10px rgba(255,240,245,0.8)',
              color: '#381f26',
            }}
          >
            {monthName}
          </span>
        </button>

        {/* Next Month Button [ > ] */}
        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Next Month"
          className="glass-btn flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl cursor-pointer text-white/95 hover:text-white"
          title="Next Month"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Spacer or Month/Year Badge for symmetry */}
      <div className="w-10 sm:w-12 flex items-center justify-center">
        <span className="font-botanical text-xs sm:text-sm font-semibold text-rose-100/90 drop-shadow-xs">
          {currentYear}
        </span>
      </div>
    </nav>
  );
};
