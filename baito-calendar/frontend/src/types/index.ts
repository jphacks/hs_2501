// バイトの勤務記録
export interface WorkDay {
  date: string; // YYYY-MM-DD形式
  hours: number; // 勤務時間
  wage: number; // その日の給料
  memo?: string; // メモ
}

// 設定
export interface Settings {
  paymentType: 'hourly' | 'daily'; // 時給制 or 日給制
  hourlyWage?: number; // 時給
  dailyWage?: number; // 日給
  defaultHours: number; // デフォルト勤務時間
}

// 月別サマリー
export interface MonthlySummary {
  year: number;
  month: number;
  workDays: number;
  totalHours: number;
  totalWage: number;
}

// 年別サマリー
export interface YearlySummary {
  year: number;
  workDays: number;
  totalHours: number;
  totalWage: number;
  monthlyData: MonthlySummary[];
}

