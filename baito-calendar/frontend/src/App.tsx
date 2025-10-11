import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import Settings from './components/Settings';
import Summary from './components/Summary';
import { Settings as SettingsType, MonthlySummary, YearlySummary } from './types';
import { getSettings, saveSettings, getWorkDaysInMonth, getWorkDaysInYear } from './utils/storage';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [settings, setSettings] = useState<SettingsType>(getSettings());
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary>({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    workDays: 0,
    totalHours: 0,
    totalWage: 0,
  });
  const [yearlySummary, setYearlySummary] = useState<YearlySummary>({
    year: currentDate.getFullYear(),
    workDays: 0,
    totalHours: 0,
    totalWage: 0,
    monthlyData: [],
  });

  // サマリーを計算
  const calculateSummaries = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    // 月次サマリー
    const monthWorkDays = getWorkDaysInMonth(year, month);
    const monthlyTotal = monthWorkDays.reduce(
      (acc, day) => ({
        workDays: acc.workDays + 1,
        totalHours: acc.totalHours + day.hours,
        totalWage: acc.totalWage + day.wage,
      }),
      { workDays: 0, totalHours: 0, totalWage: 0 }
    );

    setMonthlySummary({
      year,
      month,
      ...monthlyTotal,
    });

    // 年次サマリー
    const yearWorkDays = getWorkDaysInYear(year);
    const yearlyTotal = yearWorkDays.reduce(
      (acc, day) => ({
        workDays: acc.workDays + 1,
        totalHours: acc.totalHours + day.hours,
        totalWage: acc.totalWage + day.wage,
      }),
      { workDays: 0, totalHours: 0, totalWage: 0 }
    );

    // 月別データを集計
    const monthlyDataMap = new Map<number, MonthlySummary>();
    yearWorkDays.forEach((day) => {
      const dayMonth = parseInt(day.date.split('-')[1]);
      const existing = monthlyDataMap.get(dayMonth) || {
        year,
        month: dayMonth,
        workDays: 0,
        totalHours: 0,
        totalWage: 0,
      };
      monthlyDataMap.set(dayMonth, {
        ...existing,
        workDays: existing.workDays + 1,
        totalHours: existing.totalHours + day.hours,
        totalWage: existing.totalWage + day.wage,
      });
    });

    setYearlySummary({
      year,
      ...yearlyTotal,
      monthlyData: Array.from(monthlyDataMap.values()),
    });
  };

  // 初回読み込みと日付変更時にサマリーを更新
  useEffect(() => {
    calculateSummaries();
  }, [currentDate]);

  // 設定保存
  const handleSaveSettings = (newSettings: SettingsType) => {
    saveSettings(newSettings);
    setSettings(newSettings);
  };

  // データ変更時にサマリーを再計算
  const handleDataChange = () => {
    calculateSummaries();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* ヘッダー */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-3">
            💰 バイト給料カレンダー
          </h1>
          <p className="text-gray-600 text-lg">
            勤務日を選択して、月の給料と年間の給料を簡単に管理しましょう
          </p>
        </header>

        {/* メインコンテンツ */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* 左列: カレンダー */}
          <div className="lg:col-span-2">
            <Calendar 
              settings={settings} 
              onDataChange={handleDataChange}
            />
          </div>

          {/* 右列: 設定 */}
          <div>
            <Settings settings={settings} onSave={handleSaveSettings} />
          </div>
        </div>

        {/* サマリーセクション */}
        <Summary
          currentDate={currentDate}
          monthlySummary={monthlySummary}
          yearlySummary={yearlySummary}
        />

        {/* フッター */}
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>© 2024 バイト給料カレンダー - シンプルなバイト管理アプリ</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

