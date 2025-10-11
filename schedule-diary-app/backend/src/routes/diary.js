import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Google Gemini クライアントの初期化関数
const createGemini = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

// 絵日記生成エンドポイント
router.post('/generate-diary', async (req, res) => {
  try {
    const { schedule } = req.body;

    // バリデーション
    if (!schedule || !Array.isArray(schedule) || schedule.length === 0) {
      return res.status(400).json({
        error: 'Invalid schedule data',
        message: 'スケジュールデータが正しくありません'
      });
    }

    // APIキーのチェック
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key not configured',
        message: 'Gemini APIキーが設定されていません'
      });
    }

    console.log('Generating diary for schedule:', schedule);

    // スケジュールから日記文を生成
    const diaryPrompt = `
以下のタイムスケジュールから、楽しい絵日記の文章を生成してください：

${schedule.map(item => `${item.time}: ${item.activity}`).join('\n')}

以下の要素を含めてください：
- 一日の振り返りと感想
- 活動の詳細な描写（感情豊かに）
- 印象に残った出来事の説明
- 明日への期待や目標

文体：親しみやすい日記調で、絵文字も適度に含める
長さ：300-400文字程度
語調：温かみがあり、前向きな内容
`;

    console.log('Generating diary text with Gemini...');
    const genAI = createGemini();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(diaryPrompt);
    const response = await result.response;
    const diaryText = response.text();

    // 画像はデフォルト画像を使用（画像生成なし）
    const diaryImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&q=80';

    console.log('Diary generation completed successfully (text only)');

    res.json({
      diaryText,
      diaryImage,
      success: true
    });

  } catch (error) {
    console.error('Error generating diary:', error);
    
    // Gemini API エラーの場合
    if (error.message && error.message.includes('API key')) {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'Gemini APIキーが無効です'
      });
    } else if (error.message && error.message.includes('quota')) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'APIの利用制限に達しました。しばらく待ってから再試行してください'
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: '絵日記の生成に失敗しました。もう一度お試しください。',
      details: error.message
    });
  }
});

// ヘルスチェック
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    service: 'diary-api',
    timestamp: new Date().toISOString()
  });
});

export default router;
