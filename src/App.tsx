import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BottomBar } from './components/BottomBar';
import { DahliaFlower } from './components/DahliaFlower';
import { HelpModal } from './components/HelpModal';
import { MeadowBackground } from './components/MeadowBackground';
import { MenuDrawer } from './components/MenuDrawer';
import { MonthPickerModal } from './components/MonthPickerModal';
import { MonthlyDrawer } from './components/MonthlyDrawer';
import { MoodBar } from './components/MoodBar';
import { MoodModal } from './components/MoodModal';
import { ReminderModal } from './components/ReminderModal';
import { TopBar } from './components/TopBar';
import { ZoomControl } from './components/ZoomControl';
import { StorageService } from './services/storage';
import { MoodEntry, MoodType } from './types';

export default function App() {
  // Calendar state - Initialized from persistent view state (defaults to October 2026)
  const initialView = useMemo(() => StorageService.loadViewState(), []);
  const [currentYear, setCurrentYear] = useState<number>(initialView.year);
  const [currentMonth, setCurrentMonth] = useState<number>(initialView.month);

  // Day 15 selected by default to match the reference image with watercolor splash
  const [selectedDay, setSelectedDay] = useState<number | null>(15);

  // Zoom scale for flower: persisted with default 1.18
  const DEFAULT_ZOOM = 1.18;
  const [scale, setScale] = useState<number>(initialView.scale || DEFAULT_ZOOM);

  const handleResetZoom = () => {
    setScale(DEFAULT_ZOOM);
  };

  // Auto-save view state whenever year, month, or zoom changes
  useEffect(() => {
    StorageService.saveViewState({
      year: currentYear,
      month: currentMonth,
      scale,
    });
  }, [currentYear, currentMonth, scale]);

  // Quick paint active mood: null by default so petal taps instantly select and open mood options
  const [quickPaintMood, setQuickPaintMood] = useState<MoodType | null>(null);

  // Modals state
  const [isMoodModalOpen, setIsMoodModalOpen] = useState<boolean>(false);
  const [isMonthlyDrawerOpen, setIsMonthlyDrawerOpen] = useState<boolean>(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState<boolean>(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState<boolean>(false);

  // Settings
  const [settings] = useState(() => StorageService.loadSettings());

  // Persistent entries
  const [allEntries, setAllEntries] = useState<Record<string, MoodEntry>>(() =>
    StorageService.loadAllEntries()
  );

  // Number of days in the active month
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  // Current month's entries map (day -> MoodEntry)
  const currentMonthEntries = useMemo(() => {
    const result: Record<number, MoodEntry> = {};
    const prefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-`;
    for (const [key, entry] of Object.entries(allEntries)) {
      if (key.startsWith(prefix)) {
        result[entry.day] = entry;
      }
    }
    return result;
  }, [allEntries, currentYear, currentMonth]);

  // Stats calculation
  const stats = useMemo(() => {
    return StorageService.getMonthStats(currentYear, currentMonth, daysInMonth);
  }, [allEntries, currentYear, currentMonth, daysInMonth]);

  // Reload data
  const handleDataRefresh = useCallback(() => {
    setAllEntries(StorageService.loadAllEntries());
  }, []);

  // Direct mood saving for the small dropup/dropdown (silent, persistent)
  const handleSaveMoodDirect = useCallback(
    (day: number, mood: MoodType) => {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const existing = allEntries[dateStr];
      const newEntry: MoodEntry = {
        date: dateStr,
        day,
        month: currentMonth,
        year: currentYear,
        mood,
        intensity: existing?.intensity || 4,
        note: existing?.note,
        tags: existing?.tags,
        updatedAt: Date.now(),
      };
      const updated = StorageService.saveEntry(newEntry);
      setAllEntries({ ...updated });
    },
    [currentYear, currentMonth, allEntries]
  );

  // Petal click handler (silent)
  const handleSelectDay = useCallback(
    (day: number | null) => {
      setSelectedDay(day);

      // If quick-paint mood is active, directly assign mood
      if (day !== null && quickPaintMood) {
        handleSaveMoodDirect(day, quickPaintMood);
      }
    },
    [quickPaintMood, handleSaveMoodDirect]
  );

  // Save mood entry
  const handleSaveEntry = useCallback(
    (entry: MoodEntry) => {
      const updated = StorageService.saveEntry(entry);
      setAllEntries({ ...updated });
    },
    []
  );

  // Delete mood entry
  const handleDeleteEntry = useCallback(
    (day: number) => {
      const updated = StorageService.deleteEntry(currentYear, currentMonth, day);
      setAllEntries({ ...updated });
    },
    [currentYear, currentMonth]
  );

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null);
  };

  const handleSelectMonthYear = (newYear: number, newMonth: number) => {
    setCurrentYear(newYear);
    setCurrentMonth(newMonth);
    setSelectedDay(null);
  };

  const handleResetData = () => {
    const fresh = StorageService.resetAll();
    setAllEntries({ ...fresh });
    setSelectedDay(15);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevMonth();
      else if (e.key === 'ArrowRight') handleNextMonth();
      else if (e.key === 'Escape') {
        setIsMoodModalOpen(false);
        setIsMonthlyDrawerOpen(false);
        setIsReminderModalOpen(false);
        setIsHelpModalOpen(false);
        setIsMenuDrawerOpen(false);
        setIsMonthPickerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMonth, currentYear]);

  const activeEntry = selectedDay ? currentMonthEntries[selectedDay] : null;

  return (
    <main className="relative w-full h-[100dvh] max-h-[100dvh] min-h-screen overflow-hidden flex flex-col justify-between font-sans select-none">
      {/* 1. Luminous Golden Hour Meadow Background */}
      <MeadowBackground />

      {/* 2. Top Header Bar with branding "miTmood by mitraa for friends" */}
      <TopBar
        onOpenMenu={() => setIsMenuDrawerOpen(true)}
        onOpenReminder={() => setIsReminderModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        hasReminderActive={settings.reminderEnabled}
      />

      {/* 3. Mood Pills Legend Bar */}
      <MoodBar
        stats={stats}
        quickPaintMood={quickPaintMood}
        onSetQuickPaintMood={setQuickPaintMood}
      />

      {/* 4. Left Zoom Slider & Suspended Dewdrop */}
      <ZoomControl
        scale={scale}
        onZoomChange={setScale}
        onResetAll={handleResetZoom}
      />

      {/* 5. Center Dahlia Flower Petal Calendar (Proportionate on PC & Phone) */}
      <section aria-label="Dahlia mood calendar" className="relative flex-1 w-full min-h-0 flex items-center justify-center overflow-visible z-10 px-2 my-auto">
        <DahliaFlower
          daysInMonth={daysInMonth}
          entries={currentMonthEntries}
          selectedDay={selectedDay}
          onSelectDay={handleSelectDay}
          onSaveMood={handleSaveMoodDirect}
          onDeleteMood={handleDeleteEntry}
          scale={scale}
        />
      </section>

      {/* 6. Bottom Navigation Controls (List, Prev, Month Pill, Next, Year) */}
      <BottomBar
        currentMonth={currentMonth}
        currentYear={currentYear}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onOpenMonthlyList={() => setIsMonthlyDrawerOpen(true)}
        onOpenMonthPicker={() => setIsMonthPickerOpen(true)}
      />

      {/* 7. Modals & Drawers */}
      {/* Mood Logging Modal (When a petal is tapped) */}
      <MoodModal
        isOpen={isMoodModalOpen}
        day={selectedDay}
        month={currentMonth}
        year={currentYear}
        existingEntry={activeEntry}
        onSave={handleSaveEntry}
        onDelete={handleDeleteEntry}
        onClose={() => setIsMoodModalOpen(false)}
      />

      {/* Monthly Record & Journal Drawer */}
      <MonthlyDrawer
        isOpen={isMonthlyDrawerOpen}
        onClose={() => setIsMonthlyDrawerOpen(false)}
        year={currentYear}
        month={currentMonth}
        stats={stats}
        entries={currentMonthEntries}
        onSelectDay={(day) => {
          setSelectedDay(day);
          setIsMoodModalOpen(true);
        }}
        onMonthChange={handleSelectMonthYear}
        onDataRefresh={handleDataRefresh}
      />

      {/* Month Picker Modal */}
      <MonthPickerModal
        isOpen={isMonthPickerOpen}
        onClose={() => setIsMonthPickerOpen(false)}
        currentYear={currentYear}
        currentMonth={currentMonth}
        onSelectMonthYear={handleSelectMonthYear}
      />

      {/* Daily Reminder Modal */}
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
      />

      {/* How it Works / Botanical Flower Guide */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* Menu Drawer */}
      <MenuDrawer
        isOpen={isMenuDrawerOpen}
        onClose={() => setIsMenuDrawerOpen(false)}
        onOpenMonthlyList={() => setIsMonthlyDrawerOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onResetData={handleResetData}
      />
    </main>
  );
}
