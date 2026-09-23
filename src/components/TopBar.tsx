import React from 'react';

interface TopBarProps {
  onOpenMenu: () => void;
  onOpenReminder: () => void;
  onOpenHelp: () => void;
  hasReminderActive?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMenu,
  onOpenReminder,
  onOpenHelp,
  hasReminderActive = true,
}) => {
  return (
    <header className="relative z-30 flex items-center justify-between w-full px-3 pt-2.5 pb-1 sm:px-6 sm:pt-4 sm:pb-2 max-w-4xl mx-auto shrink-0">
      {/* Left Menu Button [ ≡ ] */}
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu and statistics"
        className="glass-btn flex flex-col items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl cursor-pointer group shrink-0"
      >
        <span className="w-4 sm:w-5 h-0.5 bg-white/90 rounded-full mb-1 group-hover:bg-white transition-colors" />
        <span className="w-4 sm:w-5 h-0.5 bg-white/90 rounded-full mb-1 group-hover:bg-white transition-colors" />
        <span className="w-4 sm:w-5 h-0.5 bg-white/90 rounded-full group-hover:bg-white transition-colors" />
      </button>

      {/* Center Logo [ miTbloom by mitraa for friends ] */}
      <div className="flex flex-col items-center justify-center select-none pointer-events-none text-center px-2">
        <h1
          className="font-logo text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide text-white leading-none"
          style={{
            textShadow:
              '0 0 14px rgba(255, 192, 218, 0.85), 0 0 24px rgba(255, 130, 180, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          miTbloom
        </h1>
        <span
          className="font-serif italic text-[11px] sm:text-xs text-rose-100/90 tracking-wider mt-0.5 font-medium"
          style={{
            textShadow: '0 1px 3px rgba(0,0,0,0.4)',
          }}
        >
          by mitraa for friends
        </span>
      </div>

      {/* Right Controls: Notification Bell [ 🔔 ] & Help [ ? ] */}
      <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
        {/* Notification Bell */}
        <button
          type="button"
          onClick={onOpenReminder}
          aria-label="Daily mood reminder settings"
          className="glass-btn relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl cursor-pointer text-white/95 hover:text-white"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
          {hasReminderActive && (
            <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-2 h-2 rounded-full bg-rose-400 ring-2 ring-white/60 animate-pulse" />
          )}
        </button>

        {/* Question Mark Help Button */}
        <button
          type="button"
          onClick={onOpenHelp}
          aria-label="How it works and guide"
          className="glass-btn flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl cursor-pointer text-white/95 hover:text-white"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 17.25h.008v.008H12v-.008z"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};
