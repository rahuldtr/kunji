import React from 'react';
import { MONTH_NAMES } from '../constants/moods';

interface MonthPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentYear: number;
  currentMonth: number;
  onSelectMonthYear: (year: number, month: number) => void;
}

export const MonthPickerModal: React.FC<MonthPickerModalProps> = ({
  isOpen,
  onClose,
  currentYear,
  currentMonth,
  onSelectMonthYear,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="select-month-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel w-full max-w-sm p-6 rounded-3xl shadow-2xl bg-white/90 text-stone-800 border border-white/70 relative"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="select-month-title" className="font-botanical text-xl font-bold text-stone-900">
            Select Blooming Month
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close month selector"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-200 text-stone-600 hover:bg-stone-300 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Year Selector */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-stone-100/90 mb-4">
          <button
            type="button"
            onClick={() => onSelectMonthYear(currentYear - 1, currentMonth)}
            className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
          >
            ◀
          </button>
          <span className="font-botanical text-lg font-bold text-stone-900">
            {currentYear}
          </span>
          <button
            type="button"
            onClick={() => onSelectMonthYear(currentYear + 1, currentMonth)}
            className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
          >
            ▶
          </button>
        </div>

        {/* 12 Months Grid */}
        <div className="grid grid-cols-3 gap-2">
          {MONTH_NAMES.map((name, idx) => {
            const isSelected = idx === currentMonth;
            return (
              <button
                key={name}
                type="button"
                onClick={() => {
                  onSelectMonthYear(currentYear, idx);
                  onClose();
                }}
                className={`py-2.5 px-1 rounded-xl text-center cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-rose-500 text-white font-bold shadow-md scale-105'
                    : 'bg-stone-100/80 hover:bg-rose-50 text-stone-700 text-xs font-semibold'
                }`}
              >
                <div className="font-script text-xl leading-none">{name}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
