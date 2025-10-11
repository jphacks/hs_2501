# 🚀 セットアップガイド

## 📋 必要なもの

1. **Node.js** (v18以上)
   - [公式サイト](https://nodejs.org/)からダウンロード
   - インストール後、ターミナルで `node --version` を実行して確認

2. **OpenAI API Key**
   - [OpenAI Platform](https://platform.openai.com/api-keys)でアカウント作成
   - API Keyを生成（有料プランが必要）

## 🔧 ステップバイステップセットアップ

### Step 1: Node.jsのインストール確認

```bash
node --version
npm --version
```

### Step 2: バックエンドのセットアップ

```bash
# プロジェクトディレクトリに移動
cd "C:\Users\owner\cursor練習\schedule-diary-app\backend"

# 依存関係をインストール
npm install
```

### Step 3: OpenAI API Keyの設定

1. `backend/.env` ファイルを開く
2. `your_openai_api_key_here` を実際のAPIキーに置き換える

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=5000
NODE_ENV=development
```

### Step 4: フロントエンドのセットアップ

```bash
# フロントエンドディレクトリに移動
cd "../frontend"

# 依存関係をインストール
npm install
```

### Step 5: アプリケーションの起動

#### ターミナル1: バックエンドサーバー起動
```bash
cd "C:\Users\owner\cursor練習\schedule-diary-app\backend"
npm run dev
```

#### ターミナル2: フロントエンドサーバー起動
```bash
cd "C:\Users\owner\cursor練習\schedule-diary-app\frontend"
npm run dev
```

### Step 6: ブラウザでアクセス

- **アプリケーション**: http://localhost:3000
- **API ヘルスチェック**: http://localhost:5000/health

## 🎯 動作確認

1. ブラウザで http://localhost:3000 にアクセス
2. スケジュールを入力（例：8:00 ランニング）
3. 「✨ 絵日記を生成する ✨」ボタンをクリック
4. AIが日記文とイラストを生成

## ⚠️ 注意事項

- **OpenAI API**: 使用量に応じて課金されます
- **インターネット接続**: API通信のため必要
- **初回生成**: 初回は時間がかかる場合があります

## 🔍 トラブルシューティング

### エラー: 'npm' は認識されません
- Node.jsが正しくインストールされていません
- ターミナルを再起動してください

### エラー: OPENAI_API_KEY is not set
- `.env`ファイルのAPIキーを確認してください
- ファイルの保存を確認してください

### エラー: Port 5000 is already in use
- 別のアプリケーションがポート5000を使用しています
- `.env`ファイルで`PORT=5001`などに変更してください

## 📞 サポート

問題が解決しない場合は、以下を確認してください：
1. Node.jsのバージョン
2. インターネット接続
3. OpenAI APIキーの有効性
4. ターミナルの出力メッセージ
