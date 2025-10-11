import { WorkDay, Settings } from '../types';

const STORAGE_KEYS = {
  WORK_DAYS: 'baito-calendar-work-days',
  SETTINGS: 'baito-calendar-settings',
};

// デフォルト設定
const DEFAULT_SETTINGS: Settings = {
  paymentType: 'hourly',
  hourlyWage: 1200,
  dailyWage: 10000,
  defaultHours: 8,
};

// 設定の取得
export const getSettings = (): Settings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('設定の読み込みに失敗しました:', error);
  }
  return DEFAULT_SETTINGS;
};

// 設定の保存
export const saveSettings = (settings: Settings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('設定の保存に失敗しました:', error);
  }
};

// 勤務日データの取得
export const getWorkDays = (): WorkDay[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.WORK_DAYS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('勤務日データの読み込みに失敗しました:', error);
  }
  return [];
};

// 勤務日データの保存
export const saveWorkDays = (workDays: WorkDay[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.WORK_DAYS, JSON.stringify(workDays));
  } catch (error) {
    console.error('勤務日データの保存に失敗しました:', error);
  }
};

// 特定の日の勤務データを取得
export const getWorkDayByDate = (date: string): WorkDay | undefined => {
  const workDays = getWorkDays();
  return workDays.find((day) => day.date === date);
};

// 勤務日を追加または更新
export const addOrUpdateWorkDay = (workDay: WorkDay): void => {
  const workDays = getWorkDays();
  const index = workDays.findIndex((day) => day.date === workDay.date);
  
  if (index >= 0) {
    workDays[index] = workDay;
  } else {
    workDays.push(workDay);
  }
  
  saveWorkDays(workDays);
};

// 勤務日を削除
export const removeWorkDay = (date: string): void => {
  const workDays = getWorkDays();
  const filtered = workDays.filter((day) => day.date !== date);
  saveWorkDays(filtered);
};

// 指定月の勤務日を取得
export const getWorkDaysInMonth = (year: number, month: number): WorkDay[] => {
  const workDays = getWorkDays();
  const monthStr = String(month).padStart(2, '0');
  const prefix = `${year}-${monthStr}`;
  
  return workDays.filter((day) => day.date.startsWith(prefix));
};

// 指定年の勤務日を取得
export const getWorkDaysInYear = (year: number): WorkDay[] => {
  const workDays = getWorkDays();
  const prefix = `${year}`;
  
  return workDays.filter((day) => day.date.startsWith(prefix));
};

