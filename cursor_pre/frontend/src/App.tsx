import React, { useState, useEffect } from 'react';
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
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [keywords, setKeywords] = useState<string>('');

  // アプリ起動時にローカルストレージから日記を読み込み
  useEffect(() => {
    try {
      const storedDiaries = localStorage.getItem('diaries');
      if (storedDiaries) {
        const diaries: DiaryEntry[] = JSON.parse(storedDiaries);
        const diaryMap = new Map<string, DiaryEntry>();
        diaries.forEach(diary => {
          diaryMap.set(diary.date, diary);
        });
        setSavedDiaries(diaryMap);
      }
    } catch (error) {
      console.error('ローカルストレージ読み込みエラー:', error);
    }
  }, []);

  // 日付を文字列に変換
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // 日付選択ハンドラ
  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
      setError('');

      // 新しい日付に移動する際にフィールドをリセット
      setSelectedImage(null);
      setImagePreview(null);
      setSelectedEmotion('');
      setKeywords('');
      setDiary('');

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
      // 既存の日記がある場合は、その日記に関連する情報は表示しない
      setSelectedImage(null);
      setSelectedEmotion('');
      setKeywords('');
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
        // 既存の日記がある場合は、その日記に関連する情報は表示しない
        setSelectedImage(null);
        setSelectedEmotion('');
        setKeywords('');
      }
    } catch (err: any) {
      if (err.response?.status !== 404) {
        console.error('日記の読み込みエラー:', err);
      }
      // 404の場合は日記が存在しないので、フィールドはクリアされたまま
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
    formData.append('emotion', selectedEmotion);
    formData.append('keywords', keywords);

    try {
      const response = await axios.post(`${API_URL}/api/generate-diary`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const diaryText = response.data.diary;
        setDiary(diaryText);

        // 必ず保存されるように改善
        const dateStr = formatDate(selectedDate);
        const newEntry: DiaryEntry = {
          date: dateStr,
          text: diaryText,
          imageData: imagePreview?.split(',')[1] || '',
          imageMimeType: selectedImage.type,
          createdAt: new Date().toISOString()
        };

        // ローカルキャッシュに保存
        setSavedDiaries(prev => {
          const newMap = new Map(prev);
          newMap.set(dateStr, newEntry);
          return newMap;
        });

        // ローカルストレージにも保存（永続化）
        try {
          const allDiaries = Array.from(savedDiaries.values());
          allDiaries.push(newEntry);
          localStorage.setItem('diaries', JSON.stringify(allDiaries));
        } catch (error) {
          console.error('ローカルストレージ保存エラー:', error);
        }
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* 1. タイトルセクション（本の表紙風） */}
        <div className="text-center py-8">
          <h1 className="text-6xl font-serif font-bold text-orange-900 drop-shadow-lg">
            AIbum
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-amber-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* 2. カレンダーセクション（本のページ風） */}
        <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-8 rounded-2xl shadow-xl border border-orange-200">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-serif font-semibold text-orange-900 mb-2">
              📅 カレンダー
            </h2>
            <div className="w-16 h-0.5 bg-orange-600 mx-auto"></div>
          </div>
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-orange-200">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                locale="ja-JP"
              />
            </div>
          </div>
          <p className="text-center mt-6 text-orange-800 text-lg font-medium">
            選択日: {selectedDate.toLocaleDateString('ja-JP')}
          </p>
        </div>

        {/* 3. 開いた本のセクション */}
        <div className="bg-gradient-to-br from-amber-100 to-yellow-100 p-8 rounded-2xl shadow-xl border border-amber-200 relative">
          {/* 罫線の背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl"
            style={{
              backgroundImage: `
                   linear-gradient(to right, rgba(251, 146, 60, 0.1) 1px, transparent 1px),
                   linear-gradient(to bottom, rgba(251, 146, 60, 0.1) 1px, transparent 1px)
                 `,
              backgroundSize: '20px 20px'
            }}>
          </div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-semibold text-orange-900 mb-2">
                📸 日記
              </h2>
              <div className="w-16 h-0.5 bg-amber-600 mx-auto"></div>
            </div>

            {/* 開いた本のデザイン */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-orange-200">
              <div className="flex">
                {/* 本の背表紙部分（中央） */}
                <div className="w-2 bg-gradient-to-b from-orange-600 to-amber-600 flex items-center justify-center">
                  <div className="w-0.5 h-8 bg-orange-800 rounded-full"></div>
                </div>

                {/* 左ページ */}
                <div className="flex-1 p-8 border-r border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
                  <div className="h-full flex flex-col justify-between">
                    {/* 画像アップロード部分 */}
                    <div className="space-y-6">
                      <h3 className="text-2xl font-serif font-semibold text-orange-900 mb-6 flex items-center">
                        📷 {selectedDate.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}の写真
                      </h3>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-600
                        file:mr-4 file:py-3 file:px-6
                        file:rounded-xl file:border-0
                        file:text-sm file:font-semibold
                        file:bg-orange-100 file:text-orange-800
                        hover:file:bg-orange-200
                        cursor-pointer transition-all duration-200"
                      />
                      {imagePreview && (
                        <div className="mt-6">
                          <img
                            src={imagePreview}
                            alt="プレビュー"
                            className="w-full h-48 object-cover rounded-xl shadow-lg border border-orange-200"
                          />
                        </div>
                      )}

                      {/* 感情選択 */}
                      <div className="mt-6">
                        <h4 className="text-lg font-serif font-semibold text-orange-900 mb-3">
                          😊 あなたの気持ち（任意）
                        </h4>
                        <div className="grid grid-cols-4 gap-2">
                          {['😊', '😢', '😍', '😴', '😋', '😎', '🤔', '🥳'].map((emotion) => (
                            <button
                              key={emotion}
                              onClick={() => setSelectedEmotion(emotion)}
                              className={`text-2xl p-3 rounded-lg transition-all duration-200 ${selectedEmotion === emotion
                                ? 'bg-orange-300 shadow-lg scale-110'
                                : 'bg-orange-100 hover:bg-orange-200 hover:scale-105'
                                }`}
                            >
                              {emotion}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ハッシュタグ入力 */}
                      <div className="mt-6">
                        <h4 className="text-lg font-serif font-semibold text-orange-900 mb-3">
                          🏷️ ハッシュタグ（任意）
                        </h4>
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="#美味しい料理 #友達と #楽しい時間 #旅行 #家族"
                            className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent font-serif text-gray-700"
                          />
                          <p className="text-sm text-orange-600 font-serif">
                            💡 例: #美味しい料理 #友達と #楽しい時間 #旅行 #家族
                          </p>
                          {keywords && (
                            <div className="mt-2">
                              <p className="text-xs text-orange-500 font-serif mb-1">プレビュー（#を除いた部分）:</p>
                              <div className="flex flex-wrap gap-1">
                                {keywords.split(' ').filter(tag => tag.trim()).map((tag, index) => {
                                  const cleanTag = tag.replace(/^#+/, '').trim();
                                  return cleanTag ? (
                                    <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-serif">
                                      {cleanTag}
                                    </span>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 生成ボタン（小さく） */}
                    <div className="mt-8">
                      <button
                        onClick={handleGenerateDiary}
                        disabled={loading || !selectedImage}
                        className={`w-full py-3 px-6 rounded-xl font-semibold text-white text-base
                        ${loading || !selectedImage
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:from-orange-700 active:to-amber-700 shadow-lg hover:shadow-xl'
                          }
                        transition-all duration-300 transform hover:scale-105`}
                      >
                        {loading ? '生成中...' : (diary ? '🔄 再生成' : '✨ 日記をつくる')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 右ページ */}
                <div className="flex-1 p-8 bg-gradient-to-br from-orange-50 to-amber-50">
                  <h3 className="text-2xl font-serif font-semibold text-orange-900 mb-6 flex items-center">
                    📖 {selectedDate.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}の日記
                  </h3>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                      <p className="text-red-700 whitespace-pre-line">{error}</p>
                    </div>
                  )}

                  {loading && (
                    <div className="flex items-center justify-center py-20">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500"></div>
                    </div>
                  )}

                  {diary && !loading && (
                    <div className="bg-white border-l-4 border-orange-400 p-6 rounded-r-xl shadow-inner">
                      <div className="space-y-6">
                        {/* 装飾的なライン */}
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-0.5 bg-orange-400"></div>
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <div className="w-8 h-0.5 bg-orange-400"></div>
                        </div>

                        {/* 日記本文のみ表示 */}
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                          {diary}
                        </p>

                        {/* 装飾的なライン */}
                        <div className="flex items-center justify-end space-x-2">
                          <div className="w-8 h-0.5 bg-orange-400"></div>
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <div className="w-12 h-0.5 bg-orange-400"></div>
                        </div>
                      </div>

                      {/* 日付 */}
                      <p className="text-sm text-orange-600 mt-8 text-right font-medium border-t border-orange-200 pt-4">
                        {selectedDate.toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}

                  {!diary && !loading && !error && (
                    <div className="text-center py-20 text-orange-400">
                      <p className="text-lg font-serif">日記を生成すると、ここに表示されます</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;



