import React, { useState } from 'react';
import ScheduleInput from './components/ScheduleInput';
import DiaryDisplay from './components/DiaryDisplay';
import { ScheduleItem } from './types';
import { generateDiary } from './services/api';

function App() {
  const [diaryText, setDiaryText] = useState<string>('');
  const [diaryImage, setDiaryImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateDiary = async (schedule: ScheduleItem[]) => {
    setIsLoading(true);
    setDiaryText('');
    setDiaryImage('');
    
    try {
      const result = await generateDiary(schedule);
      setDiaryText(result.diaryText);
      setDiaryImage(result.diaryImage);
    } catch (error) {
      console.error('Error generating diary:', error);
      alert('絵日記の生成に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            📖 スケジュール絵日記 ✨
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            あなたの一日を美しい絵日記に変換しましょう。<br />
            時間と活動を入力するだけで、AIが素敵な日記を作成します。
          </p>
        </header>

        {/* メインコンテンツ */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* スケジュール入力 */}
          <div>
            <ScheduleInput onGenerate={handleGenerateDiary} />
          </div>

          {/* 絵日記表示 */}
          <div>
            <DiaryDisplay 
              diaryText={diaryText}
              diaryImage={diaryImage}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* フッター */}
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>© 2024 スケジュール絵日記 - AI搭載の日記作成アプリ</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

