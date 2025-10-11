import express from 'express';
const router = express.Router();

// Google Gemini クライアントの初期化関数（動的インポート。未インストールの場合は null を返す）
const createGemini = async () => {
  if (!process.env.GEMINI_API_KEY) {
    return null; // APIキーが無ければモックを使う
  }
  try {
    const mod = await import('@google/generative-ai');
    if (mod && mod.GoogleGenerativeAI) {
      return new mod.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return null;
  } catch (e) {
    console.warn('Google Generative AI client not available, falling back to stubbed generation');
    return null;
  }
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
    // NOTE: GEMINI_API_KEY is optional — when not present we will use stubbed generation

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

    console.log('Attempting to generate diary text with Gemini...');
    const gemini = await createGemini();
    let diaryText = '';
    let diaryImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&q=80';

    if (gemini) {
      try {
        const model = gemini.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(diaryPrompt);
        const response = await result.response;
        diaryText = response.text();
      } catch (e) {
        console.warn('Gemini generation failed, falling back to stub:', e.message || e);
      }
    }

    // Gemini が無いまたは失敗した場合のスタブ
    if (!diaryText) {
      diaryText = `今日は${schedule.length}つの予定がありました。とても充実した一日で、特に${schedule[0].activity}が印象的でした。😊`; 
    }

    console.log('Diary generation completed (possibly stubbed)');

    res.json({ diaryText, diaryImage, success: true });

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
