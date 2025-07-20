const express = require('express');
const cron = require('node-cron');
const path = require('path');
const fetchAndSendNews = require('./src/fetchNews');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/fetch-news', async (req, res) => {
  try {
    console.log('📱 手動でニュース取得を実行...');
    await fetchAndSendNews();
    res.json({ 
      success: true, 
      message: 'AIニュースの取得とメール送信が完了しました！' 
    });
  } catch (error) {
    console.error('エラー:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'エラーが発生しました: ' + error.message 
    });
  }
});

app.get('/status', (req, res) => {
  res.json({
    status: 'running',
    message: 'AIニュース取得サービスが稼働中です',
    nextRun: '毎日午前9時に自動実行',
    email: process.env.RECIPIENT_EMAIL || 'araiguma47@gmail.com'
  });
});

cron.schedule('0 9 * * *', async () => {
  console.log('⏰ 定期実行: 毎日9時のAIニュース取得を開始...');
  try {
    await fetchAndSendNews();
  } catch (error) {
    console.error('定期実行でエラーが発生:', error.message);
  }
}, {
  timezone: "Asia/Tokyo"
});

app.listen(PORT, () => {
  console.log(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
  console.log(`📧 メール送信先: ${process.env.RECIPIENT_EMAIL || 'araiguma47@gmail.com'}`);
  console.log('⏰ 毎日午前9時に自動でAIニュースをメール送信します');
  console.log('💡 手動実行: POST /fetch-news');
});