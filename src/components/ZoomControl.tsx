import React from 'react';

interface ZoomControlProps {
  scale: number;
  onZoomChange: (newScale: number) => void;
  onResetAll?: () => void;
}

export const ZoomControl: React.FC<ZoomControlProps> = ({ scale, onZoomChange, onResetAll }) => {
  const minScale = 0.85;
  const maxScale = 1.45;

  const handleZoomIn = () => {
    onZoomChange(Math.min(maxScale, Number((scale + 0.15).toFixed(2))));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(minScale, Number((scale - 0.15).toFixed(2))));
  };

  // Calculate percentage for slider thumb height
  const percent = Math.round(((scale - minScale) / (maxScale - minScale)) * 100);

  return (
    <aside aria-label="Zoom controls" className="fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center select-none pointer-events-auto scale-80 sm:scale-100 origin-left">
      {/* Frosted Glass Vertical Capsule */}
      <div className="glass-panel w-9 sm:w-10 py-3.5 px-1.5 rounded-full flex flex-col items-center space-y-3 shadow-lg">
        {/* Zoom In Button [+] */}
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="Zoom In"
          className="w-6 h-6 flex items-center justify-center text-white/95 hover:text-white font-light text-xl cursor-pointer transition-transform active:scale-90"
        >
          +
        </button>

        {/* Vertical Track & Thumb */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickY = e.clientY - rect.top;
            const frac = 1 - clickY / rect.height; // top is max, bottom is min
            const target = minScale + frac * (maxScale - minScale);
            onZoomChange(Number(Math.min(maxScale, Math.max(minScale, target)).toFixed(2)));
          }}
          className="relative w-1.5 h-24 sm:h-28 bg-white/30 rounded-full cursor-pointer overflow-hidden backdrop-blur-xs"
        >
          {/* Active Level Track */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-white/90 rounded-full transition-all duration-150"
            style={{ height: `${percent}%` }}
          />
        </div>

        {/* Zoom Out Button [−] */}
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Zoom Out"
          className="w-6 h-6 flex items-center justify-center text-white/95 hover:text-white font-light text-xl cursor-pointer transition-transform active:scale-90"
        >
          −
        </button>
      </div>

      {/* Suspended Crystal Dewdrop */}
      <div className="mt-3 flex flex-col items-center">
        <div
          className="dewdrop animate-pulse cursor-pointer"
          title="Morning Dewdrop (Reset Flower Position & Zoom)"
          onClick={() => {
            if (onResetAll) {
              onResetAll();
            } else {
              onZoomChange(1.0);
            }
          }}
        />
      </div>
    </aside>
  );
};
