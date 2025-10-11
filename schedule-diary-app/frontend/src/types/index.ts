export interface ScheduleItem {
  time: string;
  activity: string;
}

export interface DiaryData {
  diaryText: string;
  diaryImage: string;
}

export interface ApiResponse {
  success: boolean;
  data?: DiaryData;
  error?: string;
}
