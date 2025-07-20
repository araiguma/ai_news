const axios = require('axios');
const cheerio = require('cheerio');

class NewsParser {
  async fetchAINews() {
    try {
      console.log('はてなブックマークからAI開発関連記事を取得中...');
      const news = await this.fetchFromHatenaBookmarks();
      return news.slice(0, 10);
    } catch (error) {
      console.error('はてなブックマーク取得エラー:', error.message);
      return [];
    }
  }

  async fetchFromHatenaBookmarks() {
    try {
      const url = 'https://b.hatena.ne.jp/q/AI?date_range=5y&target=tag&sort=popular&users=50';
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const articles = [];

      $('.entrylist-item').each((index, element) => {
        if (index >= 20) return false;

        const titleElement = $(element).find('.entrylist-contents-title a');
        const title = titleElement.text().trim();
        const link = titleElement.attr('href');
        const description = $(element).find('.entrylist-contents-description').text().trim();
        const users = $(element).find('.entrylist-contents-users').text().trim();

        if (title && link && this.isDevRelated(title, description)) {
          articles.push({
            title,
            link,
            source: 'はてなブックマーク',
            description: description || '',
            users: users || '',
            date: new Date().toISOString().split('T')[0]
          });
        }
      });

      console.log(`開発関連記事を${articles.length}件発見しました`);
      return articles;
    } catch (error) {
      console.error('はてなブックマーク解析エラー:', error.message);
      return [];
    }
  }

  isDevRelated(title, description) {
    const devKeywords = [
      'API', 'SDK', 'ライブラリ', 'フレームワーク', 'プログラミング', 'コード', '開発', 
      'GitHub', 'オープンソース', 'Python', 'JavaScript', 'TypeScript', 'React', 
      'Node.js', 'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Azure',
      'TensorFlow', 'PyTorch', 'Hugging Face', 'OpenAI API', 'LangChain',
      'RAG', 'ベクトル', 'エンベディング', 'ファインチューニング', 'プロンプト',
      'チャットボット', '実装', 'チュートリアル', 'ハンズオン', 'サンプル',
      '技術', 'エンジニア', 'プログラマー', 'デベロッパー', 'アプリ開発',
      'Webアプリ', 'モバイルアプリ', 'CLI', 'ツール', 'プラグイン'
    ];

    const text = (title + ' ' + description).toLowerCase();
    return devKeywords.some(keyword => 
      text.includes(keyword.toLowerCase()) || 
      text.includes(keyword)
    );
  }

  formatNewsForEmail(newsArray) {
    if (!newsArray || newsArray.length === 0) {
      return {
        subject: '本日のAIニュース - 情報が取得できませんでした',
        html: '<h2>申し訳ございません</h2><p>本日はAIニュースを取得できませんでした。明日再度お試しください。</p>'
      };
    }

    const today = new Date().toLocaleDateString('ja-JP');
    
    let html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
          🤖 AI開発ニュース (${today})
        </h2>
        <p style="color: #7f8c8d;">はてなブックマークから開発に関わるAI記事を厳選してお届けします。</p>
    `;

    newsArray.forEach((article, index) => {
      html += `
        <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #3498db; background-color: #f8f9fa;">
          <h3 style="margin: 0 0 10px 0; color: #2c3e50;">
            <a href="${article.link}" style="text-decoration: none; color: #2c3e50;">
              ${index + 1}. ${article.title}
            </a>
          </h3>
          ${article.description ? `<p style="margin: 10px 0; color: #555; font-size: 14px; line-height: 1.4;">${article.description}</p>` : ''}
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            📰 ${article.source} ${article.users ? `| 👥 ${article.users}` : ''}
          </p>
          <a href="${article.link}" style="color: #3498db; text-decoration: none; font-weight: bold;">
            記事を読む →
          </a>
        </div>
      `;
    });

    html += `
        <div style="margin-top: 30px; padding: 15px; background-color: #ecf0f1; border-radius: 5px;">
          <p style="margin: 0; color: #7f8c8d; font-size: 12px; text-align: center;">
            このメールは自動送信されています。毎日最新のAI情報をお届けします。
          </p>
        </div>
      </div>
    `;

    return {
      subject: `🤖 AI開発ニュース - ${today} (${newsArray.length}件)`,
      html: html
    };
  }
}

module.exports = NewsParser;