import React from 'react';
import { FlowerIcon } from './FlowerIcon';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel w-full max-w-md p-6 rounded-3xl shadow-2xl bg-white/90 text-stone-800 border border-white/70 relative max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌸</span>
            <div>
              <h2 id="help-title" className="font-botanical text-2xl font-bold text-stone-900 leading-tight">
                miTbloom
              </h2>
              <div className="font-serif italic text-xs text-rose-800/80 font-medium">
                by mitraa for friends
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close help guide"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-200 text-stone-600 hover:bg-stone-300 transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-stone-600 mb-4 leading-relaxed">
          <strong className="text-stone-800">miTbloom by mitraa for friends</strong> transforms your calendar into a living, blooming botanical dahlia. Each petal represents a day of the month.
        </p>

        {/* Petal Colors Legend */}
        <div className="space-y-2.5 mb-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            The Petal Colors
          </h3>

          <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-rose-50/80 border border-rose-100">
            <FlowerIcon mood="happy" size={30} />
            <div>
              <div className="font-script text-2xl text-rose-800 leading-tight">Happy</div>
              <div className="text-[11px] text-stone-600">
                Coral Red — joyful, inspired, grateful & energized moments.
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-amber-50/80 border border-amber-100">
            <FlowerIcon mood="neutral" size={30} />
            <div>
              <div className="font-script text-2xl text-amber-800 leading-tight">Neutral</div>
              <div className="text-[11px] text-stone-600">
                Amber Yellow — balanced, calm, routine & steady days.
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-2.5 rounded-xl bg-purple-50/80 border border-purple-100">
            <FlowerIcon mood="sad" size={30} />
            <div>
              <div className="font-script text-2xl text-purple-800 leading-tight">Sad / Tired</div>
              <div className="text-[11px] text-stone-600">
                Lavender Violet — low energy, resting, or tender moments.
              </div>
            </div>
          </div>
        </div>

        {/* Navigation & Controls Guide */}
        <div className="space-y-2 mb-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            How to Use
          </h3>
          <ul className="text-xs text-stone-600 space-y-2 list-disc list-inside">
            <li>
              <strong>Tap Any Petal:</strong> Log your daily feelings, intensity, and journal reflections.
            </li>
            <li>
              <strong>Left Zoom Slider:</strong> Adjust the dahlia view; tap the hanging crystal dewdrop to reset.
            </li>
            <li>
              <strong>Bottom List Button:</strong> View your full monthly emotional breakdown and diary entries.
            </li>
            <li>
              <strong>Data Persistence:</strong> All your records remain safe in your browser. You can export or import backups at any time.
            </li>
          </ul>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 text-white text-xs font-semibold shadow-md cursor-pointer transition-all active:scale-95"
        >
          Begin Blooming 🌿
        </button>
      </div>
    </div>
  );
};
