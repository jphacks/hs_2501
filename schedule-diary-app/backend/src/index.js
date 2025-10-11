import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import diaryRoutes from './routes/diary.js';
import authRoutes from './routes/auth.js';
import diariesRoutes from './routes/diaries.js';

// 環境変数の読み込み
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ミドルウェア
app.use(cors());
app.use(express.json());

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Schedule Diary API is running!',
    timestamp: new Date().toISOString()
  });
});

// ルート
app.use('/api', diaryRoutes);
app.use('/auth', authRoutes);
app.use('/api/diaries', diariesRoutes);

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'サーバーでエラーが発生しました'
  });
});

// 404ハンドリング
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: '指定されたエンドポイントが見つかりません'
  });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📖 Schedule Diary API is ready!`);

  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  WARNING: GEMINI_API_KEY is not set in environment variables');
    console.warn('   Please set your Google Gemini API key in .env file');
    console.warn('   Get your API key at: https://makersuite.google.com/app/apikey');
  }
});

