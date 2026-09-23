import React, { useState } from 'react';
import { MONTH_NAMES, MOODS } from '../constants/moods';
import { MoodEntry, MoodType } from '../types';
import { FlowerIcon } from './FlowerIcon';

interface MoodModalProps {
  isOpen: boolean;
  day: number | null;
  month: number;
  year: number;
  existingEntry?: MoodEntry | null;
  onSave: (entry: MoodEntry) => void;
  onDelete: (day: number) => void;
  onClose: () => void;
}

export const MoodModal: React.FC<MoodModalProps> = ({
  isOpen,
  day,
  month,
  year,
  existingEntry,
  onSave,
  onDelete,
  onClose,
}) => {
  const [note, setNote] = useState<string>(existingEntry?.note || '');
  const [showNoteInput, setShowNoteInput] = useState<boolean>(Boolean(existingEntry?.note));

  if (!isOpen || day === null) return null;

  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const monthName = MONTH_NAMES[month];

  // 1-Tap instant mood log
  const handlePickMood = (mood: MoodType) => {
    const entry: MoodEntry = {
      date: dateStr,
      day,
      month,
      year,
      mood,
      note: note.trim() || undefined,
      updatedAt: Date.now(),
    };
    onSave(entry);
    onClose();
  };

  const handleClear = () => {
    onDelete(day);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-day-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel w-full max-w-sm p-5 rounded-3xl shadow-2xl bg-white/90 text-stone-800 border border-white/70 relative"
      >
        {/* Header: Date + Close */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-baseline space-x-2">
            <h2 id="modal-day-title" className="font-botanical text-2xl font-bold text-stone-900">
              {monthName} {day}
            </h2>
            <span className="text-xs text-stone-500 font-medium">How are you feeling?</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-600 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 3 Large Instant-Tap Mood Buttons */}
        <div className="grid grid-cols-3 gap-2.5 mb-3">
          {(['happy', 'neutral', 'sad'] as MoodType[]).map((m) => {
            const cfg = MOODS[m];
            const isCurrent = existingEntry?.mood === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => handlePickMood(m)}
                className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-2xl border transition-all duration-200 cursor-pointer active:scale-95 ${
                  isCurrent
                    ? 'bg-white shadow-lg ring-2 ring-rose-400 scale-[1.04] border-rose-300'
                    : 'bg-white/60 hover:bg-white border-stone-200/70 shadow-xs'
                }`}
              >
                <div className="transform hover:scale-110 transition-transform">
                  <FlowerIcon mood={m} size={42} />
                </div>
                <span
                  className="font-script text-2xl font-bold mt-1.5 leading-none"
                  style={{ color: cfg.textColor }}
                >
                  {cfg.label}
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5">Tap to log</span>
              </button>
            );
          })}
        </div>

        {/* Optional simple one-line note */}
        {showNoteInput ? (
          <div className="mb-3">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional quick note..."
              maxLength={80}
              className="w-full px-3 py-1.5 text-xs bg-white/80 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400 text-stone-800 placeholder-stone-400"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowNoteInput(true)}
            className="text-[11px] text-stone-500 hover:text-stone-800 transition-colors mb-2 block mx-auto cursor-pointer"
          >
            + Add a quick note
          </button>
        )}

        {/* Clear Option if already logged */}
        {existingEntry && (
          <div className="pt-2 border-t border-stone-200/60 text-center">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer transition-colors"
            >
              Clear Petal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
