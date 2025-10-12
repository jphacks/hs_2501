import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface DiaryEntry {
  date: string;
  text: string;
  imageData: string;
  imageMimeType: string;
  createdAt: string;
}

const API_URL = 'http://localhost:3001';

function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [diary, setDiary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [savedDiaries, setSavedDiaries] = useState<Map<string, DiaryEntry>>(new Map());

  // 日付を文字列に変換
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // 日付選択ハンドラ
  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setError('');
      loadDiaryForDate(value);
    }
  };

  // 画像選択ハンドラ
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setError('');
      
      // プレビュー用のURL作成
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 特定の日付の日記を読み込む
  const loadDiaryForDate = async (date: Date) => {
    const dateStr = formatDate(date);
    
    // すでに読み込み済みの場合
    if (savedDiaries.has(dateStr)) {
      const entry = savedDiaries.get(dateStr)!;
      setDiary(entry.text);
      setImagePreview(`data:${entry.imageMimeType};base64,${entry.imageData}`);
      return;
    }

    // サーバーから取得
    try {
      const response = await axios.get(`${API_URL}/api/diary/${dateStr}`);
      if (response.data.success) {
        const entry = response.data.diary;
        setDiary(entry.text);
        setImagePreview(`data:${entry.imageMimeType};base64,${entry.imageData}`);
        setSavedDiaries(prev => new Map(prev).set(dateStr, entry));
      }
    } catch (err: any) {
      if (err.response?.status !== 404) {
        console.error('日記の読み込みエラー:', err);
      }
      // 404の場合は日記が存在しないだけなので、クリア
      setDiary('');
      setImagePreview(null);
      setSelectedImage(null);
    }
  };

  // 日記生成
  const handleGenerateDiary = async () => {
    if (!selectedImage) {
      setError('画像を選択してください');
      return;
    }

    setLoading(true);
    setError('');
    setDiary('');

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('date', formatDate(selectedDate));

    try {
      const response = await axios.post(`${API_URL}/api/generate-diary`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const diaryText = response.data.diary;
        setDiary(diaryText);
        
        // 保存された日記をローカルキャッシュに追加
        const dateStr = formatDate(selectedDate);
        const newEntry: DiaryEntry = {
          date: dateStr,
          text: diaryText,
          imageData: imagePreview?.split(',')[1] || '',
          imageMimeType: selectedImage.type,
          createdAt: new Date().toISOString()
        };
        setSavedDiaries(prev => new Map(prev).set(dateStr, newEntry));
      }
    } catch (err: any) {
      console.error('エラー:', err);
      
      if (err.response?.data?.error) {
        const errorType = err.response.data.error;
        const errorMessage = err.response.data.message;
        
        if (errorType === 'APIキーエラー') {
          setError(`❌ APIキーエラー: ${errorMessage}`);
        } else if (errorType === 'ネットワークエラー') {
          setError(`🌐 ネットワークエラー: ${errorMessage}`);
        } else {
          setError(`⚠️ ${errorType}: ${errorMessage}`);
        }
      } else if (err.code === 'ERR_NETWORK') {
        setError('🌐 ネットワークエラー: バックエンドサーバーに接続できません。サーバーが起動しているか確認してください。');
      } else {
        setError('⚠️ エラーが発生しました。もう一度お試しください。');
      }
    } finally {
      setLoading(false);
    }
  };

  // base64 文字列を File に変換
  const base64ToFile = (base64: string, mime: string, filename: string) => {
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new File([ab], filename, { type: mime });
  };

  // 任意の File から生成処理を行う（handleGenerateDiary と同様の処理を受け取った file で実行）
  const generateFromFile = async (file: File) => {
    setLoading(true);
    setError('');
    setDiary('');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('date', formatDate(selectedDate));

    try {
      const response = await axios.post(`${API_URL}/api/generate-diary`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        const diaryText = response.data.diary;
        setDiary(diaryText);

        const dateStr = formatDate(selectedDate);
        const newEntry: DiaryEntry = {
          date: dateStr,
          text: diaryText,
          imageData: imagePreview?.split(',')[1] || '',
          imageMimeType: file.type,
          createdAt: new Date().toISOString(),
        };
        setSavedDiaries(prev => new Map(prev).set(dateStr, newEntry));
      }
    } catch (err: any) {
      console.error('エラー:', err);
      setError('⚠️ 再生成中にエラーが発生しました。コンソールを確認してください。');
    } finally {
      setLoading(false);
    }
  };

  // 日記を削除（ローカルキャッシュからのみ削除）
  const handleDeleteDiary = () => {
    const dateStr = formatDate(selectedDate);
    setSavedDiaries(prev => {
      const m = new Map(prev);
      m.delete(dateStr);
      return m;
    });
    setDiary('');
  };

  // 日記を再生成（selectedImage がなければ保存済みの imageData を使って再生成）
  const handleRegenerateDiary = async () => {
    const dateStr = formatDate(selectedDate);

    if (loading) return;

    if (selectedImage) {
      await handleGenerateDiary();
      return;
    }

    const entry = savedDiaries.get(dateStr);
    if (!entry || !entry.imageData) {
      setError('再生成する画像が見つかりません。画像をアップロードしてください。');
      return;
    }

    try {
      const file = base64ToFile(entry.imageData, entry.imageMimeType || 'image/jpeg', `${dateStr}.jpg`);
      // update preview so user sees it
      setImagePreview(`data:${entry.imageMimeType};base64,${entry.imageData}`);
      await generateFromFile(file);
    } catch (err) {
      console.error('再生成エラー:', err);
      setError('⚠️ 再生成に失敗しました');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">
          📸 画像日記生成アプリ
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 左側：カレンダーと操作 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                1. 日付を選択
              </h2>
              <div className="flex justify-center">
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  locale="ja-JP"
                />
              </div>
              <p className="text-center mt-4 text-gray-600">
                選択日: {selectedDate.toLocaleDateString('ja-JP')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                2. 画像をアップロード
              </h2>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100
                  cursor-pointer"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="プレビュー"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                3. 日記を生成
              </h2>
              <button
                onClick={handleGenerateDiary}
                disabled={loading || !selectedImage}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white
                  ${loading || !selectedImage
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                  }
                  transition-colors duration-200`}
              >
                {loading ? '生成中...' : '日記を生成する'}
              </button>
            </div>
          </div>

          {/* 右側：結果表示 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              4. 生成された日記
            </h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 whitespace-pre-line">{error}</p>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {diary && !loading && (
              <div className="prose max-w-none">
                <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {diary}
                  </p>
                  <p className="text-sm text-gray-500 mt-4 text-right">
                    {selectedDate.toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <div className="mt-4 flex gap-3 justify-end">
                    <button
                      onClick={handleDeleteDiary}
                      className="py-2 px-4 rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      削除
                    </button>
                    <button
                      onClick={handleRegenerateDiary}
                      disabled={loading}
                      className={`py-2 px-4 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                      再生成
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!diary && !loading && !error && (
              <div className="text-center py-12 text-gray-400">
                <p>日記を生成すると、ここに表示されます</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            📝 使い方
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>カレンダーで日付を選択します</li>
            <li>画像アップロードボタンから画像を選択します</li>
            <li>「日記を生成する」ボタンを押します</li>
            <li>生成された日記が右側に表示されます</li>
            <li>カレンダーの日付を選択すると、その日の日記を確認できます</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;

