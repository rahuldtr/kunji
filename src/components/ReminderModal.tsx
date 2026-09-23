import React, { useState } from 'react';
import { StorageService } from '../services/storage';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onClose }) => {
  const settings = StorageService.loadSettings();
  const [reminderTime, setReminderTime] = useState(settings.dailyReminder);
  const [enabled, setEnabled] = useState(settings.reminderEnabled);
  const [savedMessage, setSavedMessage] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    StorageService.saveSettings({
      ...settings,
      dailyReminder: reminderTime,
      reminderEnabled: enabled,
    });
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reminder-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel w-full max-w-sm p-6 rounded-3xl shadow-2xl bg-white/90 text-stone-800 border border-white/70 relative"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🔔</span>
            <h2 id="reminder-title" className="font-botanical text-xl font-bold text-stone-900">
              Daily Mood Check-In
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close reminder dialog"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-200 text-stone-600 hover:bg-stone-300 transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-stone-600 mb-4 leading-relaxed">
          Set a tranquil evening moment to reflect on your day and color your blooming dahlia petal.
        </p>

        {/* Toggle & Time Picker */}
        <div className="p-3.5 rounded-2xl bg-stone-100/90 border border-stone-200/70 mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-700">Enable Daily Reminder</span>
            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                enabled ? 'bg-rose-500' : 'bg-stone-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {enabled && (
            <div className="flex items-center justify-between pt-2 border-t border-stone-200">
              <span className="text-xs font-semibold text-stone-700">Reminder Time</span>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="px-2.5 py-1 text-sm bg-white border border-stone-300 rounded-lg text-stone-800 font-medium"
              />
            </div>
          )}
        </div>

        {/* Daily Affirmation */}
        <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100 mb-4 text-center">
          <p className="font-script text-2xl text-rose-800 leading-tight">
            "Like petals to a flower, every emotion has its own sacred beauty."
          </p>
        </div>

        {savedMessage ? (
          <div className="text-center py-2 text-xs font-bold text-emerald-600">
            ✓ Reminder settings updated!
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-semibold shadow-md cursor-pointer transition-all active:scale-95"
          >
            Save Reminder
          </button>
        )}
      </div>
    </div>
  );
};
