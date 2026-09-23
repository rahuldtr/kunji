import React, { useState } from 'react';
import { MONTH_NAMES, MOODS } from '../constants/moods';
import { MoodEntry, MoodStats, MoodType } from '../types';
import { FlowerIcon } from './FlowerIcon';

interface MonthlyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number;
  stats: MoodStats;
  entries: Record<number, MoodEntry>;
  onSelectDay: (day: number) => void;
  onMonthChange?: (year: number, month: number) => void;
  onDataRefresh?: () => void;
}

export const MonthlyDrawer: React.FC<MonthlyDrawerProps> = ({
  isOpen,
  onClose,
  year,
  month,
  stats,
  entries,
  onSelectDay,
  onMonthChange,
}) => {
  const [filterMood, setFilterMood] = useState<MoodType | 'all'>('all');

  if (!isOpen) return null;

  const monthName = MONTH_NAMES[month];
  const entriesList = Object.values(entries).sort((a, b) => b.day - a.day);
  const filteredList =
    filterMood === 'all' ? entriesList : entriesList.filter((e) => e.mood === filterMood);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="monthly-records-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-xs select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-stone-900/90 text-stone-100 backdrop-blur-xl border-l border-white/10 shadow-2xl flex flex-col p-4 sm:p-5 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 shrink-0">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-rose-300 font-semibold flex items-center space-x-1.5">
              <span>miTbloom by mitraa for friends</span>
            </span>
            <h2 id="monthly-records-title" className="font-botanical text-2xl font-bold text-white flex items-center space-x-2">
              <span>{monthName}</span>
              <span className="text-stone-400 font-normal">{year}</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close monthly records"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {/* Monthly Statistics Pill Card */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-semibold tracking-wider text-stone-400">
                Emotional Bloom Score
              </span>
              <span className="text-xs font-medium text-rose-300">
                {stats.totalLogged} / {stats.totalDays} Days Logged
              </span>
            </div>

            {/* Percentage Bar */}
            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden flex mb-3">
              <div
                style={{ width: `${stats.happyPercentage}%` }}
                className="bg-rose-500 h-full transition-all"
                title={`Happy: ${stats.happyPercentage}%`}
              />
              <div
                style={{ width: `${stats.neutralPercentage}%` }}
                className="bg-amber-400 h-full transition-all"
                title={`Neutral: ${stats.neutralPercentage}%`}
              />
              <div
                style={{ width: `${stats.sadPercentage}%` }}
                className="bg-purple-500 h-full transition-all"
                title={`Sad/Tired: ${stats.sadPercentage}%`}
              />
            </div>

            {/* Stats Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <div className="font-script text-xl font-bold text-rose-300">Happy</div>
                <div className="text-sm font-bold text-white">{stats.happyPercentage}%</div>
                <div className="text-[10px] text-stone-400">{stats.happyCount} days</div>
              </div>
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="font-script text-xl font-bold text-amber-300">Neutral</div>
                <div className="text-sm font-bold text-white">{stats.neutralPercentage}%</div>
                <div className="text-[10px] text-stone-400">{stats.neutralCount} days</div>
              </div>
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <div className="font-script text-xl font-bold text-purple-300">Sad/Tired</div>
                <div className="text-sm font-bold text-white">{stats.sadPercentage}%</div>
                <div className="text-[10px] text-stone-400">{stats.sadCount} days</div>
              </div>
            </div>
          </div>

          {/* Month Switcher Mini Carousel */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Browse Other Months
            </div>
            <div className="flex space-x-1.5 overflow-x-auto pb-2">
              {MONTH_NAMES.map((mName, idx) => (
                <button
                  key={mName}
                  type="button"
                  onClick={() => onMonthChange?.(year, idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap cursor-pointer transition-colors ${
                    idx === month
                      ? 'bg-rose-500 text-white font-semibold shadow-xs'
                      : 'bg-white/5 hover:bg-white/15 text-stone-300'
                  }`}
                >
                  {mName}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Entries List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Daily Entries ({filteredList.length})
              </div>
              {/* Filter Tabs */}
              <div className="flex space-x-1">
                {(['all', 'happy', 'neutral', 'sad'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFilterMood(m)}
                    className={`text-[10px] px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                      filterMood === m ? 'bg-white/30 text-white font-bold' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {m === 'all' ? 'All' : m}
                  </button>
                ))}
              </div>
            </div>

            {filteredList.length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-sm">
                No entries recorded for this filter. Tap a petal to log!
              </div>
            ) : (
              <div className="space-y-2">
                {filteredList.map((entry) => {
                  const cfg = MOODS[entry.mood];
                  return (
                    <div
                      key={entry.date}
                      onClick={() => {
                        onSelectDay(entry.day);
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all flex items-start space-x-3 group"
                    >
                      <div className="shrink-0 pt-0.5">
                        <FlowerIcon mood={entry.mood} size={28} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-botanical text-sm font-semibold text-white group-hover:text-rose-300 transition-colors">
                            {monthName} {entry.day}
                          </span>
                          <span
                            className="font-script text-lg leading-none"
                            style={{ color: cfg.color }}
                          >
                            {cfg.label}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-xs text-stone-300 mt-1 line-clamp-2 italic">
                            "{entry.note}"
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer: Automatic Local Storage Persistence & Branding */}
        <div className="pt-3 border-t border-white/10 flex flex-col items-center justify-center shrink-0 space-y-1 select-none">
          <div className="flex items-center space-x-1.5 text-xs text-rose-200/90 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Auto-saved to local storage • Past & current records remembered</span>
          </div>
          <div className="text-[11px] text-stone-400 font-serif italic">
            miTmood by mitraa for friends
          </div>
        </div>
      </div>
    </div>
  );
};
