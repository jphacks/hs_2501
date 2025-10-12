# 📸 画像日記生成アプリ

Gemini AIを使用して、アップロードした画像から日記を自動生成するWebアプリケーションです。

## 📋 機能

- 📅 カレンダーで日付を選択
- 🖼️ 画像をアップロード
- 🤖 Gemini AIが画像から200字程度の日記を生成
- 💾 生成した日記を日付ごとに保存・閲覧
- ⚠️ エラー時にAPIキー/ネットワークの問題を判別して表示

## 🚀 必要な環境

- Node.js 18以上
- Gemini API キー（無料で取得可能）

## 🔑 Gemini APIキーの取得方法

1. [Google AI Studio](https://makersuite.google.com/app/apikey)にアクセス
2. Googleアカウントでログイン
3. 「Create API Key」をクリック
4. APIキーをコピー

## 📦 セットアップ手順

### 1. バックエンドのセットアップ

```bash
cd backend
npm install
```

`.env`ファイルを`backend`フォルダに作成し、以下の内容を記述：

```env
GEMINI_API_KEY=ここにあなたのAPIキーを貼り付け
PORT=3001
```

### 2. フロントエンドのセットアップ

```bash
cd frontend
npm install
```

## ▶️ 起動方法

### バックエンドを起動（ターミナル1）

```bash
cd backend
npm start
```

サーバーが`http://localhost:3001`で起動します。

### フロントエンドを起動（ターミナル2）

```bash
cd frontend
npm run dev
```

ブラウザで`http://localhost:5173`を開いてください。

## 📖 使い方

1. **日付を選択**: カレンダーで日記を作成したい日付をクリック
2. **画像をアップロード**: 「ファイルを選択」ボタンから画像を選択
3. **日記を生成**: 「日記を生成する」ボタンをクリック
4. **日記を確認**: 生成された日記が右側に表示されます
5. **過去の日記を確認**: カレンダーで別の日付を選択すると、その日の日記が表示されます

## ⚠️ エラーメッセージについて

### ❌ APIキーエラー

```
Gemini APIキーが設定されていません
Gemini APIキーが無効です
```

**解決方法**: `backend/.env`ファイルに正しいAPIキーが設定されているか確認してください。

### 🌐 ネットワークエラー

```
ネットワーク接続に問題があります
バックエンドサーバーに接続できません
```

**解決方法**: 
- インターネット接続を確認してください
- バックエンドサーバーが起動しているか確認してください

## 🛠️ 技術スタック

### フロントエンド
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Calendar
- Axios

### バックエンド
- Node.js
- Express
- Multer（ファイルアップロード）
- Google Generative AI SDK
- dotenv

## 📁 プロジェクト構造

```
cursor_pre/
├── backend/
│   ├── src/
│   │   └── index.js          # バックエンドメインファイル
│   ├── .env                   # 環境変数（APIキー）
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # メインアプリコンポーネント
│   │   ├── main.tsx          # エントリーポイント
│   │   └── index.css         # スタイル
│   ├── index.html
│   └── package.json
│
└── README.md
```

## 💡 開発のヒント

### 開発モードで起動

バックエンドを自動再起動モードで起動:

```bash
cd backend
npm run dev
```

### 本番ビルド

フロントエンドをビルド:

```bash
cd frontend
npm run build
```

ビルドされたファイルは`frontend/dist`フォルダに生成されます。

## 🔒 セキュリティに関する注意

- `.env`ファイルは絶対にGitにコミットしないでください
- APIキーは外部に公開しないでください
- 本番環境では、データベースを使用してデータを永続化してください

## 📝 ライセンス

MIT

## 🤝 貢献

バグ報告や機能要望は、Issueでお知らせください。

## 🙏 謝辞

このプロジェクトは[Google Gemini AI](https://ai.google.dev/)を使用しています。



