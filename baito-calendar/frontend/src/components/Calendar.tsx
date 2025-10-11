import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns';
import { ja } from 'date-fns/locale';
import { WorkDay, Settings } from '../types';
import { getWorkDayByDate, addOrUpdateWorkDay, removeWorkDay } from '../utils/storage';

interface CalendarProps {
  settings: Settings;
  onDataChange: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ settings, onDataChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [workDays, setWorkDays] = useState<Map<string, WorkDay>>(new Map());

  // カレンダー表示用の日付データ
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = getDay(monthStart);

  // 勤務日データを読み込み
  const loadWorkDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const monthStr = String(month).padStart(2, '0');
    const prefix = `${year}-${monthStr}`;
    
    const stored = JSON.parse(localStorage.getItem('baito-calendar-work-days') || '[]');
    const monthData = stored.filter((day: WorkDay) => day.date.startsWith(prefix));
    
    const map = new Map<string, WorkDay>();
    monthData.forEach((day: WorkDay) => {
      map.set(day.date, day);
    });
    setWorkDays(map);
  };

  useEffect(() => {
    loadWorkDays();
  }, [currentDate]);

  // 日付がクリックされたとき
  const handleDateClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingWorkDay = getWorkDayByDate(dateStr);

    if (existingWorkDay) {
      // すでに勤務日として登録されている場合は削除
      removeWorkDay(dateStr);
    } else {
      // 新規登録
      const wage = settings.paymentType === 'hourly' 
        ? (settings.hourlyWage || 0) * settings.defaultHours
        : (settings.dailyWage || 0);

      const newWorkDay: WorkDay = {
        date: dateStr,
        hours: settings.defaultHours,
        wage,
      };
      addOrUpdateWorkDay(newWorkDay);
    }

    loadWorkDays();
    onDataChange();
  };

  // 月を変更
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 曜日ヘッダー
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          ← 前月
        </button>
        
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {format(currentDate, 'yyyy年 M月', { locale: ja })}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors"
          >
            今月
          </button>
        </div>

        <button
          onClick={goToNextMonth}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          次月 →
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center font-semibold py-2 ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-2">
        {/* 空白セル（月の最初の曜日まで） */}
        {Array.from({ length: firstDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* 日付セル */}
        {daysInMonth.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const isWorkDay = workDays.has(dateStr);
          const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          const dayOfWeek = getDay(date);
          const isSunday = dayOfWeek === 0;
          const isSaturday = dayOfWeek === 6;

          return (
            <button
              key={dateStr}
              onClick={() => handleDateClick(date)}
              className={`
                aspect-square rounded-lg transition-all duration-200
                flex flex-col items-center justify-center
                ${isWorkDay 
                  ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-bold shadow-md hover:shadow-lg transform hover:scale-105' 
                  : 'bg-gray-50 hover:bg-gray-100'
                }
                ${isToday && !isWorkDay ? 'ring-2 ring-primary-400' : ''}
                ${isSunday && !isWorkDay ? 'text-red-500' : ''}
                ${isSaturday && !isWorkDay ? 'text-blue-500' : ''}
                ${!isWorkDay && !isSunday && !isSaturday ? 'text-gray-700' : ''}
              `}
            >
              <span className="text-lg">{format(date, 'd')}</span>
              {isWorkDay && (
                <span className="text-xs mt-1">
                  💰
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 説明 */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
        <p className="text-sm text-gray-700 text-center">
          <span className="font-semibold">💡 使い方：</span> 
          日付をクリックして勤務日を選択/解除できます
        </p>
      </div>
    </div>
  );
};

export default Calendar;

