import axios from 'axios';
import { ScheduleItem, DiaryData } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const generateDiary = async (schedule: ScheduleItem[]): Promise<DiaryData> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-diary`, {
      schedule,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error generating diary:', error);
    throw new Error('絵日記の生成に失敗しました');
  }
};

