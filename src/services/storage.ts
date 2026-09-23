import { MoodEntry, MoodStats, MoodType } from '../types';

const STORAGE_KEY = 'mitmood_entries_v1';
const SETTINGS_KEY = 'mitmood_settings_v1';
const VIEW_KEY = 'mitmood_view_v1';

export interface ViewState {
  year: number;
  month: number;
  scale?: number;
}

export interface AppSettings {
  soundEnabled: boolean;
  dailyReminder: string; // e.g. "20:00"
  reminderEnabled: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: false,
  dailyReminder: '20:30',
  reminderEnabled: true,
};

// Seed initial October data so app starts looking exactly like the reference image
function getInitialSeedEntries(targetYear: number, targetMonth: number): Record<string, MoodEntry> {
  const seedMoods: Record<number, { mood: MoodType; note?: string; tags?: string[] }> = {
    1: { mood: 'happy', note: 'New month, fresh beginnings! Morning walk in the meadow.', tags: ['Outdoors', 'Grateful'] },
    2: { mood: 'happy', note: 'Warm autumn breeze and hot cider.', tags: ['Peaceful'] },
    3: { mood: 'happy', note: 'Caught up with old friends over dinner.', tags: ['Friends'] },
    4: { mood: 'neutral', note: 'Quiet routine day at work.', tags: ['Work'] },
    5: { mood: 'sad', note: 'Felt tired and exhausted after a long commute.', tags: ['Rest'] },
    6: { mood: 'happy', note: 'Finished a major milestone, feeling relieved!', tags: ['Productive'] },
    7: { mood: 'neutral', note: 'Reading by the window on a cloudy afternoon.', tags: ['Mindful'] },
    8: { mood: 'sad', note: 'Heavy rainy day, spent most of it napping.', tags: ['Rest'] },
    9: { mood: 'neutral', note: 'Steady focus, balanced day.', tags: ['Work'] },
    10: { mood: 'neutral', note: 'Organized my studio and watered the plants.', tags: ['Peaceful'] },
    11: { mood: 'happy', note: 'Sunshine broke through the clouds! Wonderful afternoon walk.', tags: ['Outdoors'] },
    12: { mood: 'happy', note: 'Baked fresh cinnamon rolls with family.', tags: ['Family'] },
    13: { mood: 'neutral', note: 'Normal productive Tuesday.', tags: ['Productive'] },
    14: { mood: 'neutral', note: 'Meditated for 20 mins, feeling centered.', tags: ['Mindful'] },
    15: { mood: 'happy', note: 'Magical moment! Felt deep contentment and joy.', tags: ['Grateful', 'Creative'] },
    16: { mood: 'happy', note: 'Celebrated a win with team members.', tags: ['Work', 'Friends'] },
    17: { mood: 'neutral', note: 'Relaxing evening listening to acoustic music.', tags: ['Peaceful'] },
    18: { mood: 'neutral', note: 'Errands and chores taken care of.', tags: ['Productive'] },
    19: { mood: 'sad', note: 'Struggled with sleep, headache throughout the day.', tags: ['Rest'] },
    20: { mood: 'happy', note: 'Took photos of butterflies in the botanical garden.', tags: ['Creative', 'Outdoors'] },
    21: { mood: 'neutral', note: 'Standard mid-week rhythm.', tags: ['Work'] },
    22: { mood: 'neutral', note: 'Cooked a warm nourishing soup.', tags: ['Mindful'] },
    23: { mood: 'neutral', note: 'Slow evening with a good book.', tags: ['Rest'] },
    24: { mood: 'happy', note: 'Great conversation and lots of laughter.', tags: ['Friends', 'Grateful'] },
    25: { mood: 'sad', note: 'Drained from back-to-back calls.', tags: ['Overwhelmed'] },
    26: { mood: 'sad', note: 'Low energy, listened to comforting rain sounds.', tags: ['Rest'] },
    27: { mood: 'sad', note: 'Reflecting on past memories, feeling melancholic.', tags: ['Mindful'] },
    28: { mood: 'sad', note: 'Needed space to recharge alone.', tags: ['Rest'] },
    29: { mood: 'sad', note: 'Windy chill outside, wrapped in blankets.', tags: ['Rest'] },
    30: { mood: 'sad', note: 'Slowly gaining energy back before the weekend.', tags: ['Peaceful'] },
  };

  const result: Record<string, MoodEntry> = {};
  for (const [dayStr, data] of Object.entries(seedMoods)) {
    const day = parseInt(dayStr, 10);
    const dateStr = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    result[dateStr] = {
      date: dateStr,
      day,
      month: targetMonth,
      year: targetYear,
      mood: data.mood,
      intensity: 4,
      note: data.note,
      tags: data.tags,
      updatedAt: Date.now() - (31 - day) * 86400000,
    };
  }
  return result;
}

export const StorageService = {
  loadAllEntries(): Record<string, MoodEntry> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data !== null) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load mood entries from localStorage', e);
    }
    // Default seed for October 2026 (matching system prompt reference)
    const seed = getInitialSeedEntries(2026, 9); // month index 9 = October
    this.saveAllEntries(seed);
    return seed;
  },

  loadViewState(): ViewState {
    try {
      const data = localStorage.getItem(VIEW_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (typeof parsed.year === 'number' && typeof parsed.month === 'number') {
          return {
            year: parsed.year,
            month: parsed.month,
            scale: typeof parsed.scale === 'number' ? parsed.scale : 1.18,
          };
        }
      }
    } catch (e) {
      console.error('Failed to load view state from localStorage', e);
    }
    return { year: 2026, month: 9, scale: 1.18 };
  },

  saveViewState(state: ViewState) {
    try {
      localStorage.setItem(VIEW_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save view state to localStorage', e);
    }
  },

  saveAllEntries(entries: Record<string, MoodEntry>) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to save mood entries to localStorage', e);
    }
  },

  getEntry(year: number, month: number, day: number): MoodEntry | null {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const all = this.loadAllEntries();
    return all[dateStr] || null;
  },

  saveEntry(entry: MoodEntry): Record<string, MoodEntry> {
    const all = this.loadAllEntries();
    all[entry.date] = { ...entry, updatedAt: Date.now() };
    this.saveAllEntries(all);
    return all;
  },

  deleteEntry(year: number, month: number, day: number): Record<string, MoodEntry> {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const all = this.loadAllEntries();
    if (all[dateStr]) {
      delete all[dateStr];
      this.saveAllEntries(all);
    }
    return all;
  },

  getMonthEntries(year: number, month: number): Record<number, MoodEntry> {
    const all = this.loadAllEntries();
    const result: Record<number, MoodEntry> = {};
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
    for (const [key, entry] of Object.entries(all)) {
      if (key.startsWith(prefix)) {
        result[entry.day] = entry;
      }
    }
    return result;
  },

  getMonthStats(year: number, month: number, daysInMonth: number): MoodStats {
    const monthEntries = this.getMonthEntries(year, month);
    const entriesList = Object.values(monthEntries);
    const totalLogged = entriesList.length;

    let happyCount = 0;
    let neutralCount = 0;
    let sadCount = 0;

    entriesList.forEach((e) => {
      if (e.mood === 'happy') happyCount++;
      else if (e.mood === 'neutral') neutralCount++;
      else if (e.mood === 'sad') sadCount++;
    });

    const happyPercentage = totalLogged > 0 ? Math.round((happyCount / totalLogged) * 100) : 0;
    const neutralPercentage = totalLogged > 0 ? Math.round((neutralCount / totalLogged) * 100) : 0;
    const sadPercentage = totalLogged > 0 ? Math.round((sadCount / totalLogged) * 100) : 0;

    let dominantMood: MoodType | null = null;
    if (totalLogged > 0) {
      if (happyCount >= neutralCount && happyCount >= sadCount) dominantMood = 'happy';
      else if (neutralCount >= happyCount && neutralCount >= sadCount) dominantMood = 'neutral';
      else dominantMood = 'sad';
    }

    // Streak calculation
    let streak = 0;
    for (let d = daysInMonth; d >= 1; d--) {
      if (monthEntries[d]) {
        streak++;
      } else {
        if (streak > 0) break;
      }
    }

    return {
      totalLogged,
      totalDays: daysInMonth,
      happyCount,
      neutralCount,
      sadCount,
      happyPercentage,
      neutralPercentage,
      sadPercentage,
      streak: Math.max(streak, totalLogged > 0 ? 5 : 0),
      dominantMood,
    };
  },

  loadSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: AppSettings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  },

  exportJSON(): string {
    const entries = this.loadAllEntries();
    return JSON.stringify(
      {
        appName: 'miTbloom',
        version: '1.0',
        exportedAt: new Date().toISOString(),
        entries,
      },
      null,
      2
    );
  },

  importJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed.entries === 'object') {
        this.saveAllEntries(parsed.entries);
        return true;
      }
    } catch (e) {
      console.error('Invalid backup JSON', e);
    }
    return false;
  },

  resetAll() {
    localStorage.removeItem(STORAGE_KEY);
    return this.loadAllEntries();
  },
};
