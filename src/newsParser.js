const axios = require('axios');
const cheerio = require('cheerio');

class NewsParser {
  async fetchAINews() {
    const sources = [
      {
        name: 'TechCrunch AI',
        url: 'https://techcrunch.com/category/artificial-intelligence/',
        selector: '.post-block__title__link',
        linkSelector: '.post-block__title__link'
      },
      {
        name: 'VentureBeat AI',
        url: 'https://venturebeat.com/ai/',
        selector: '.ArticleListing__title',
        linkSelector: 'a'
      },
      {
        name: 'MIT Technology Review AI',
        url: 'https://www.technologyreview.com/topic/artificial-intelligence/',
        selector: '.teaserItem__title',
        linkSelector: 'a'
      }
    ];

    const allNews = [];

    for (const source of sources) {
      try {
        console.log(`Fetching news from ${source.name}...`);
        const news = await this.fetchFromSource(source);
        allNews.push(...news);
      } catch (error) {
        console.error(`Error fetching from ${source.name}:`, error.message);
      }
    }

    return allNews.slice(0, 10);
  }

  async fetchFromSource(source) {
    try {
      const response = await axios.get(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const articles = [];

      $(source.selector).each((index, element) => {
        if (index >= 5) return false;

        const title = $(element).text().trim();
        let link = '';

        if (source.linkSelector) {
          const linkElement = $(element).find(source.linkSelector).first();
          link = linkElement.attr('href') || $(element).attr('href') || '';
        } else {
          link = $(element).attr('href') || '';
        }

        if (link && !link.startsWith('http')) {
          const baseUrl = new URL(source.url).origin;
          link = baseUrl + link;
        }

        if (title && link) {
          articles.push({
            title,
            link,
            source: source.name,
            date: new Date().toISOString().split('T')[0]
          });
        }
      });

      return articles;
    } catch (error) {
      console.error(`Error parsing ${source.name}:`, error.message);
      return [];
    }
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
          🤖 今日のAIニュース (${today})
        </h2>
        <p style="color: #7f8c8d;">本日の注目すべきAI関連ニュースをお届けします。</p>
    `;

    newsArray.forEach((article, index) => {
      html += `
        <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #3498db; background-color: #f8f9fa;">
          <h3 style="margin: 0 0 10px 0; color: #2c3e50;">
            <a href="${article.link}" style="text-decoration: none; color: #2c3e50;">
              ${index + 1}. ${article.title}
            </a>
          </h3>
          <p style="margin: 5px 0; color: #7f8c8d; font-size: 14px;">
            📰 ソース: ${article.source}
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
      subject: `🤖 今日のAIニュース - ${today} (${newsArray.length}件)`,
      html: html
    };
  }
}

module.exports = NewsParser;