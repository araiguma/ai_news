const NewsParser = require('./newsParser');
const EmailService = require('./emailService');

async function fetchAndSendNews() {
  console.log('🚀 AIニュース取得を開始します...');
  
  try {
    const newsParser = new NewsParser();
    const emailService = new EmailService();

    const connectionOk = await emailService.testConnection();
    if (!connectionOk) {
      console.log('⚠️  メール設定を確認してください。.envファイルにEMAIL_APP_PASSWORDを設定する必要があります。');
      return;
    }

    console.log('📰 AIニュースを取得中...');
    const news = await newsParser.fetchAINews();
    console.log(`📊 ${news.length}件のニュースを取得しました`);

    if (news.length > 0) {
      news.forEach((article, index) => {
        console.log(`${index + 1}. ${article.title} (${article.source})`);
      });
    }

    const emailData = newsParser.formatNewsForEmail(news);
    const emailResult = await emailService.sendAINews(emailData);

    if (emailResult.success) {
      console.log('✨ 今日のAIニュースをメールで送信しました！');
    } else {
      console.log('❌ メール送信に失敗しました:', emailResult.error);
    }

  } catch (error) {
    console.error('💥 エラーが発生しました:', error.message);
  }
}

if (require.main === module) {
  fetchAndSendNews();
}

module.exports = fetchAndSendNews;