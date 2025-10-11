import React, { useState } from 'react';
import ScheduleInput from './components/ScheduleInput';
import DiaryDisplay from './components/DiaryDisplay';
import { ScheduleItem } from './types';
import { generateDiary, saveDiary } from './services/api';
import AuthForm from './components/AuthForm';
import DiaryList from './components/DiaryList';

function App() {
  const [diaryText, setDiaryText] = useState<string>('');
  const [diaryImage, setDiaryImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  const handleGenerateDiary = async (schedule: ScheduleItem[]) => {
    setIsLoading(true);
    setDiaryText('');
    setDiaryImage('');
    
    try {
      const result = await generateDiary(schedule);
      setDiaryText(result.diaryText);
      setDiaryImage(result.diaryImage);
      // 自動でログイン中に保存
      if (token) {
        try { await saveDiary(token, { content: result.diaryText, image: result.diaryImage }); } catch(e){ console.warn('Auto-save failed', e); }
      }
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
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* スケジュール入力 */}
          <div className="lg:col-span-1">
            <ScheduleInput onGenerate={handleGenerateDiary} />
            <div className="mt-4">
              <AuthForm onAuth={(t)=>setToken(t)} />
            </div>
          </div>

          {/* 絵日記表示 */}
          <div className="lg:col-span-1">
            <DiaryDisplay 
              diaryText={diaryText}
              diaryImage={diaryImage}
              isLoading={isLoading}
            />
          </div>

          {/* 過去日記 */}
          <div className="lg:col-span-1">
            {token ? <DiaryList token={token} /> : <div className="p-4 bg-white rounded shadow">ログインすると過去の日記が表示されます</div>}
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

