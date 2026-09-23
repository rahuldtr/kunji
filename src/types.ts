export type MoodType = 'happy' | 'neutral' | 'sad';

export interface MoodConfig {
  type: MoodType;
  label: string;
  name: string;
  color: string;
  gradient: string;
  glowColor: string;
  textColor: string;
  flowerColor: string;
  petalBg: string;
  strokeColor: string;
  description: string;
  iconSvg: string;
}

export interface MoodEntry {
  date: string; // YYYY-MM-DD
  day: number; // 1-31
  month: number; // 0-11
  year: number;
  mood: MoodType;
  intensity?: number; // 1-5
  note?: string;
  tags?: string[];
  updatedAt: number;
}

export interface MonthData {
  year: number;
  month: number;
  daysInMonth: number;
  entries: Record<number, MoodEntry>;
}

export interface MoodStats {
  totalLogged: number;
  totalDays: number;
  happyCount: number;
  neutralCount: number;
  sadCount: number;
  happyPercentage: number;
  neutralPercentage: number;
  sadPercentage: number;
  streak: number;
  dominantMood: MoodType | null;
}
