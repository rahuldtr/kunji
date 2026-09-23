import React, { useState } from 'react';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMonthlyList: () => void;
  onOpenHelp: () => void;
  onResetData: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  onOpenMonthlyList,
  onOpenHelp,
  onResetData,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-title"
      className="fixed inset-0 z-50 flex justify-start bg-black/45 backdrop-blur-xs select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[290px] sm:max-w-xs h-full bg-stone-900/90 text-stone-100 backdrop-blur-xl border-r border-white/10 shadow-2xl flex flex-col p-4 sm:p-5 overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10">
          <div className="flex flex-col">
            <span className="font-logo text-2xl font-bold text-white tracking-wide leading-tight">
              miTbloom
            </span>
            <span className="font-serif italic text-xs text-rose-200/90 font-medium">
              by mitraa for friends
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Navigation Options */}
        <div className="py-4 space-y-2.5 flex-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenMonthlyList();
            }}
            className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl hover:bg-white/10 text-stone-200 hover:text-white transition-colors cursor-pointer text-left group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">📊</span>
            <div>
              <div className="text-sm font-semibold">Monthly Records & Journal</div>
              <div className="text-[11px] text-stone-400">View percentages & full journal</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenHelp();
            }}
            className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl hover:bg-white/10 text-stone-200 hover:text-white transition-colors cursor-pointer text-left group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">🌸</span>
            <div>
              <div className="text-sm font-semibold">Flower Guide & Meaning</div>
              <div className="text-[11px] text-stone-400">How the petals bloom</div>
            </div>
          </button>

          {/* Automatic Local Storage Reassurance */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-stone-300">
            <div className="flex items-center space-x-2 text-rose-300 text-xs font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Persistent Local Storage</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Every petal and mood you log is automatically remembered on this device. Your historical records and journal notes stay preserved across sessions.
            </p>
          </div>
        </div>

        {/* Danger zone / Reset Demo Data */}
        <div className="pt-3 border-t border-white/10 space-y-2">
          {confirmReset ? (
            <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-center">
              <p className="text-xs text-rose-200 mb-2">Reset to initial demo records?</p>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 py-1.5 text-xs rounded-lg bg-white/10 text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onResetData();
                    setConfirmReset(false);
                    onClose();
                  }}
                  className="flex-1 py-1.5 text-xs rounded-lg bg-rose-600 font-bold text-white"
                >
                  Reset
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="w-full py-2 px-3 text-xs text-stone-400 hover:text-rose-400 text-center cursor-pointer transition-colors"
            >
              Reset to Demo Records
            </button>
          )}

          <div className="text-[10px] text-center text-stone-400 pt-1 font-serif italic">
            miTbloom by mitraa for friends
          </div>
        </div>
      </div>
    </div>
  );
};
