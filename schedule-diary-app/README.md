# 📖 スケジュール絵日記 ✨

AI搭載の日記作成アプリケーション。タイムスケジュールを入力するだけで、美しい絵日記を自動生成します。

## 🌟 機能

- **スケジュール入力**: 時間と活動を簡単に入力
- **AI日記生成**: Google Gemini APIによる自然な日記文の生成（無料）
- **画像取得**: Unsplashによる美しい写真の取得（無料）
- **レスポンシブデザイン**: スマートフォン・タブレット・PC対応
- **美しいUI**: Tailwind CSSによるモダンなデザイン

## 🛠️ 技術スタック

### フロントエンド
- **React 18** + **TypeScript**
- **Tailwind CSS** - スタイリング
- **Vite** - ビルドツール
- **Axios** - HTTP通信

### バックエンド
- **Node.js** + **Express**
- **Google Gemini API** - 無料のAIテキスト生成
- **Unsplash API** - 無料の写真取得
- **CORS** - クロスオリジン対応

## 📋 前提条件

- **Node.js** (v18以上)
- **npm** または **yarn**
- **Google Gemini API Key** ([こちら](https://makersuite.google.com/app/apikey)で取得) - 完全無料！

## 🚀 セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd schedule-diary-app
```

### 2. バックエンドのセットアップ

```bash
cd backend
npm install
```

### 3. 環境変数の設定

```bash
# .envファイルを編集
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
NODE_ENV=development
```

### 4. フロントエンドのセットアップ

```bash
cd ../frontend
npm install
```

### 5. アプリケーションの起動

#### バックエンドサーバーを起動
```bash
cd backend
npm run dev
```

#### フロントエンドサーバーを起動（別ターミナル）
```bash
cd frontend
npm run dev
```

### 6. アクセス

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:5000

## 📖 使い方

1. **スケジュール入力**
   - 時間を選択
   - 活動内容を入力
   - 「追加」ボタンでスケジュールに追加

2. **絵日記生成**
   - 「✨ 絵日記を生成する ✨」ボタンをクリック
   - AIが日記文とイラストを生成

3. **結果の確認**
   - 生成された絵日記を確認
   - 保存・共有・PDF出力（今後実装予定）

## 🔐 アカウント機能（追加）

このアプリはローカルで簡易的なアカウント機能を提供します。アカウントを作成すると、自分の過去の日記を保存・確認できます。

エンドポイント（ローカル）:
- サインアップ: POST http://localhost:5000/auth/signup  { username, password }
- ログイン:   POST http://localhost:5000/auth/login   { username, password }
- 過去日記取得: GET http://localhost:5000/api/diaries  (ヘッダ: x-auth-token: <token>)
- 日記保存: POST http://localhost:5000/api/diaries     (ヘッダ: x-auth-token: <token>, ボディ: { title, content, image })

フロー:
1. サインアップ（または既存ユーザでログイン）して token を取得します。
2. フロント上の「サインアップ／ログイン」フォームから認証を行うと自動で token を保持します。
3. 絵日記を生成すると、ログイン中であれば自動で保存され、過去日記に表示されます。

注意: 現在の実装は簡易なファイルベースの保存です。実運用にはデータベースや安全な認証（JWT 等）への移行を推奨します。

## 💻 PowerShell（Windows）での実行メモ

ターミナルで文字化けが発生する場合、PowerShell の出力エンコーディングを UTF-8 に変更すると改善します。開発中は以下を実行してください。

```powershell
chcp 65001
$OutputEncoding = [System.Text.Encoding]::UTF8
```

その後、通常のセットアップ手順（バックエンド・フロントの npm install と npm run dev）を実行してください。

例: バックエンドの依存をインストールして起動する
```powershell
cd backend
npm install
npm run dev
```

フロントの起動（別ターミナル）
```powershell
cd frontend
npm install
npm run dev
```

フロントは http://localhost:3000、バックエンドは http://localhost:5000 で動作します。

## 🎨 デザインの特徴

- **グラデーション背景**: ピンクから紫への美しいグラデーション
- **カード型レイアウト**: モダンなカードデザイン
- **アニメーション**: ローディングアニメーションとホバーエフェクト
- **絵文字**: 親しみやすい絵文字の活用
- **レスポンシブ**: すべてのデバイスサイズに対応

## 🔧 開発コマンド

### フロントエンド
```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run preview  # ビルド結果のプレビュー
npm run lint     # ESLint実行
```

### バックエンド
```bash
npm start        # 本番サーバー起動
npm run dev      # 開発サーバー起動（--watch付き）
```

## 📁 プロジェクト構造

```
schedule-diary-app/
├── frontend/                 # React アプリケーション
│   ├── src/
│   │   ├── components/       # Reactコンポーネント
│   │   │   ├── ScheduleInput.tsx
│   │   │   └── DiaryDisplay.tsx
│   │   ├── services/         # API通信
│   │   ├── types/           # TypeScript型定義
│   │   ├── App.tsx          # メインアプリ
│   │   └── main.tsx         # エントリーポイント
│   ├── public/              # 静的ファイル
│   └── package.json
├── backend/                 # Express APIサーバー
│   ├── src/
│   │   ├── routes/          # APIルート
│   │   │   └── diary.js     # 日記生成API
│   │   └── index.js         # サーバーエントリーポイント
│   ├── .env                 # 環境変数
│   └── package.json
└── README.md
```

## 🤖 AI機能の詳細

### テキスト生成 (Google Gemini)
- **プロンプト**: スケジュール情報を基にした日記生成
- **特徴**: 感情豊かで自然な日本語
- **長さ**: 300-400文字程度
- **スタイル**: 親しみやすい日記調
- **料金**: 完全無料（無料枠内で十分利用可能）

### 画像取得 (Unsplash)
- **ソース**: 高品質な無料写真
- **取得方法**: キーワードベースの自動選択
- **サイズ**: 1024x1024px
- **料金**: 完全無料

## 🔒 セキュリティ

- **APIキー**: 環境変数で管理
- **CORS**: 適切なクロスオリジン設定
- **バリデーション**: 入力データの検証
- **エラーハンドリング**: 適切なエラーレスポンス

## 🚧 今後の拡張予定

- [ ] **保存機能**: 生成された日記のローカル保存
- [ ] **共有機能**: SNS共有機能
- [ ] **PDF出力**: 日記のPDFエクスポート
- [ ] **ユーザー認証**: アカウント機能
- [ ] **日記履歴**: 過去の日記管理
- [ ] **テーマ変更**: カラーテーマの選択
- [ ] **多言語対応**: 英語版の追加

## 🐛 トラブルシューティング

### よくある問題

1. **Gemini APIエラー**
   - APIキーが正しく設定されているか確認
   - [Google AI Studio](https://makersuite.google.com/app/apikey)でAPIキーを取得

2. **CORSエラー**
   - バックエンドサーバーが起動しているか確認
   - ポート番号が正しいか確認

3. **依存関係エラー**
   - `npm install`を実行して依存関係を再インストール

## 📄 ライセンス

MIT License

## 👥 コントリビューション

プルリクエストやイシューの報告を歓迎します！

## 📞 サポート

問題が発生した場合は、GitHubのIssuesページで報告してください。

---

**🎉 素敵な絵日記を作成しましょう！**

