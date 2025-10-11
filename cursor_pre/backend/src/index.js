import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェア
app.use(cors());
app.use(express.json());

// Multer設定（メモリストレージ）
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB制限
});

// Gemini AI初期化
let genAI;
try {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} catch (error) {
  console.error('Gemini AI初期化エラー:', error);
}

// 日記データを保存する簡易ストレージ（本番環境ではデータベースを使用）
const diaries = new Map();

// 画像から日記を生成
app.post('/api/generate-diary', upload.single('image'), async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      return res.status(400).json({ 
        error: 'APIキーエラー',
        message: 'Gemini APIキーが設定されていません。.envファイルにGEMINI_API_KEYを設定してください。'
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        error: 'リクエストエラー',
        message: '画像ファイルがアップロードされていません。'
      });
    }

    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ 
        error: 'リクエストエラー',
        message: '日付が指定されていません。'
      });
    }

    // Gemini 2.5 Proモデルを使用
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // 画像データを準備
    const imageData = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype
      }
    };

    const prompt = `この画像を見て、その日の出来事を想像し、200文字程度の日記形式の文章を日本語で書いてください。
温かみのある、個人的な日記のような文体で書いてください。
具体的な描写や感情を含めてください。`;

    // 生成実行
    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const diaryText = response.text();

    // 日記を保存
    diaries.set(date, {
      date,
      text: diaryText,
      imageData: req.file.buffer.toString('base64'),
      imageMimeType: req.file.mimetype,
      createdAt: new Date().toISOString()
    });

    res.json({ 
      success: true,
      diary: diaryText 
    });

  } catch (error) {
    console.error('日記生成エラー:', error);

    // エラータイプを判定
    if (error.message?.includes('API_KEY') || error.message?.includes('authentication') || error.message?.includes('API key')) {
      return res.status(401).json({ 
        error: 'APIキーエラー',
        message: 'Gemini APIキーが無効です。正しいAPIキーを設定してください。',
        details: error.message
      });
    } else if (error.message?.includes('network') || error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'ネットワークエラー',
        message: 'ネットワーク接続に問題があります。インターネット接続を確認してください。',
        details: error.message
      });
    } else {
      return res.status(500).json({ 
        error: 'サーバーエラー',
        message: '日記の生成中にエラーが発生しました。',
        details: error.message
      });
    }
  }
});

// 特定の日付の日記を取得
app.get('/api/diary/:date', (req, res) => {
  const { date } = req.params;
  const diary = diaries.get(date);

  if (diary) {
    res.json({ success: true, diary });
  } else {
    res.status(404).json({ 
      success: false, 
      message: 'この日付の日記はまだ作成されていません。' 
    });
  }
});

// すべての日記を取得
app.get('/api/diaries', (req, res) => {
  const allDiaries = Array.from(diaries.values());
  res.json({ success: true, diaries: allDiaries });
});

app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
  console.log(`http://localhost:${PORT}`);
});

