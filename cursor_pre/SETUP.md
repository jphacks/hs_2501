# セットアップガイド

このガイドでは、画像日記生成アプリを最初から起動するまでの手順を詳しく説明します。

## 前提条件

- Node.js 18以上がインストールされていること
- インターネット接続があること

Node.jsのバージョン確認:
```bash
node --version
```

18.x.x以上が表示されればOKです。

## ステップ1: Gemini APIキーの取得

1. ブラウザで [Google AI Studio](https://makersuite.google.com/app/apikey) を開く
2. Googleアカウントでログイン
3. 「Create API Key」ボタンをクリック
4. 表示されたAPIキーをコピー（後で使用します）

## ステップ2: バックエンドのセットアップ

### 2-1. バックエンドフォルダに移動

```bash
cd backend
```

### 2-2. 依存関係をインストール

```bash
npm install
```

インストールされるパッケージ:
- express（Webサーバー）
- cors（クロスオリジンリクエスト対応）
- multer（ファイルアップロード）
- @google/generative-ai（Gemini AI SDK）
- dotenv（環境変数管理）

### 2-3. 環境変数ファイルを作成

`backend`フォルダに`.env`ファイルを作成し、以下の内容を記述：

```env
GEMINI_API_KEY=ここにステップ1で取得したAPIキーを貼り付け
PORT=3001
```

**重要**: `your_api_key_here`の部分を実際のAPIキーに置き換えてください。

例:
```env
GEMINI_API_KEY=AIzaSyABC123def456GHI789jkl012MNO345pqr
PORT=3001
```

### 2-4. バックエンドを起動

```bash
npm start
```

以下のメッセージが表示されればOK:
```
サーバーがポート3001で起動しました
http://localhost:3001
```

**このターミナルは開いたままにしておいてください。**

## ステップ3: フロントエンドのセットアップ

**新しいターミナルウィンドウを開いて**以下の手順を実行します。

### 3-1. フロントエンドフォルダに移動

```bash
cd frontend
```

### 3-2. 依存関係をインストール

```bash
npm install
```

インストールされるパッケージ:
- react, react-dom（React本体）
- typescript（TypeScript）
- vite（ビルドツール）
- tailwindcss（CSSフレームワーク）
- react-calendar（カレンダーコンポーネント）
- axios（HTTP通信）

### 3-3. フロントエンドを起動

```bash
npm run dev
```

以下のようなメッセージが表示されます:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## ステップ4: アプリを開く

ブラウザで以下のURLを開きます:

```
http://localhost:5173
```

「📸 画像日記生成アプリ」が表示されれば成功です！

## トラブルシューティング

### ポートが既に使用されている

**エラー**: `Port 3001 is already in use`

**解決方法**:
1. 他のアプリケーションがポート3001を使用していないか確認
2. または、`backend/.env`の`PORT`を別の番号（例: 3002）に変更

### APIキーエラー

**エラー**: `❌ APIキーエラー: Gemini APIキーが設定されていません`

**解決方法**:
1. `backend/.env`ファイルが存在するか確認
2. APIキーが正しく設定されているか確認
3. APIキーの前後にスペースが入っていないか確認
4. バックエンドサーバーを再起動（Ctrl+Cで停止 → `npm start`）

### ネットワークエラー

**エラー**: `🌐 ネットワークエラー: バックエンドサーバーに接続できません`

**解決方法**:
1. バックエンドサーバーが起動しているか確認
2. `http://localhost:3001`にアクセスできるか確認
3. ファイアウォールやセキュリティソフトがブロックしていないか確認

### モジュールが見つからない

**エラー**: `Cannot find module 'xxx'`

**解決方法**:
```bash
# backendまたはfrontendフォルダで実行
npm install
```

## 停止方法

両方のサーバーを停止するには、各ターミナルで`Ctrl+C`を押します。

## 再起動方法

次回起動時は以下の手順だけでOKです:

1. ターミナル1（バックエンド）:
```bash
cd backend
npm start
```

2. ターミナル2（フロントエンド）:
```bash
cd frontend
npm run dev
```

## 開発モード

ファイルを編集すると自動的に再起動するモード:

```bash
# バックエンド
cd backend
npm run dev

# フロントエンド（デフォルトで開発モード）
cd frontend
npm run dev
```

## 次のステップ

アプリが正常に動作したら、README.mdの「使い方」セクションを参照して、実際に日記を生成してみてください！



