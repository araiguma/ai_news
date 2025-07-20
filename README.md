# 🤖 AIニュース配信アプリ

毎日最新のAI関連ニュースを自動取得してメールで配信するWebアプリケーションです。

## ✨ 機能

- 📰 **自動ニュース取得**: TechCrunch、VentureBeat、MIT Technology Reviewなどから最新のAIニュースを取得
- 📧 **メール配信**: 美しいHTMLフォーマットでニュースをメール送信
- ⏰ **定期実行**: 毎日午前9時に自動実行
- 🖥️ **Web管理画面**: ブラウザから手動実行や状況確認が可能

## 🚀 セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env.example`をコピーして`.env`ファイルを作成し、以下を設定：

```env
EMAIL_USER=araiguma47@gmail.com
EMAIL_APP_PASSWORD=your-google-app-password
RECIPIENT_EMAIL=araiguma47@gmail.com
PORT=3000
```

### 3. Gmailアプリパスワードの取得
1. Googleアカウントの「セキュリティ」設定へ
2. 「2段階認証」を有効にする
3. 「アプリパスワード」を生成
4. 生成されたパスワードを`EMAIL_APP_PASSWORD`に設定

### 4. アプリの起動
```bash
npm start
```

## 📱 使用方法

### Web管理画面
- ブラウザで `http://localhost:3000` にアクセス
- 「今すぐニュースを送信」ボタンで手動実行
- 「ステータス確認」で動作状況を確認

### コマンドライン実行
```bash
npm run fetch
```

### 自動実行
- 毎日午前9時に自動でニュースを取得・送信
- 日本時間（JST）で動作

## 📂 ファイル構成

```
ai-news-fetcher/
├── src/
│   ├── newsParser.js      # ニュース取得・解析
│   ├── emailService.js    # メール送信機能
│   └── fetchNews.js       # メイン処理
├── public/
│   └── index.html         # Web管理画面
├── index.js               # サーバー起動
├── package.json
├── .env                   # 環境変数
└── README.md
```

## 🛠️ カスタマイズ

### ニュースソースの追加
`src/newsParser.js`の`sources`配列に新しいソースを追加できます。

### 配信時間の変更
`index.js`のcron設定を変更：
```javascript
// 毎日午前9時 → 午後6時に変更
cron.schedule('0 18 * * *', async () => {
  // ...
});
```

### メールテンプレートの変更
`src/newsParser.js`の`formatNewsForEmail`メソッドでHTMLテンプレートをカスタマイズ可能。

## 🔧 トラブルシューティング

### メール送信エラー
- Gmailアプリパスワードが正しく設定されているか確認
- 2段階認証が有効になっているか確認

### ニュース取得エラー
- インターネット接続を確認
- ニュースサイトがアクセス可能か確認

## 📝 ライセンス

MIT License
