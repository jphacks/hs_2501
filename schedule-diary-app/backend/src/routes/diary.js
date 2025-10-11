import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// OpenAI クライアントの初期化関数
const createOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
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
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'OpenAI API key not configured',
        message: 'OpenAI APIキーが設定されていません'
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

    console.log('Generating diary text...');
    const openai = createOpenAI();
    const diaryResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: diaryPrompt }],
      max_tokens: 500,
      temperature: 0.7,
    });

    const diaryText = diaryResponse.choices[0].message.content;

    // 画像生成用のプロンプトを作成
    const activities = schedule.map(item => item.activity).join(', ');
    const imagePrompt = `A cute, warm illustration for a diary entry showing: ${activities}. Watercolor style, soft pastel colors, kawaii aesthetic, suitable for a personal diary. The illustration should be cheerful and heartwarming, depicting the activities in a dreamy, artistic way.`;

    console.log('Generating diary image...');
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const diaryImage = imageResponse.data[0].url;

    console.log('Diary generation completed successfully');

    res.json({
      diaryText,
      diaryImage,
      success: true
    });

  } catch (error) {
    console.error('Error generating diary:', error);
    
    // OpenAI API エラーの場合
    if (error.status === 401) {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'OpenAI APIキーが無効です'
      });
    } else if (error.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'APIの利用制限に達しました。しばらく待ってから再試行してください'
      });
    } else if (error.status === 500) {
      return res.status(500).json({
        error: 'OpenAI service error',
        message: 'OpenAIサービスのエラーが発生しました'
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: '絵日記の生成に失敗しました。もう一度お試しください。'
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
