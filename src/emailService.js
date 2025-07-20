const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'araiguma47@gmail.com',
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });
  }

  async sendAINews(newsData) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'araiguma47@gmail.com',
        to: process.env.RECIPIENT_EMAIL || 'araiguma47@gmail.com',
        subject: newsData.subject,
        html: newsData.html
      };

      console.log('📧 メールを送信中...');
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ メール送信成功:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ メール送信エラー:', error.message);
      return { success: false, error: error.message };
    }
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ メールサービス接続確認OK');
      return true;
    } catch (error) {
      console.error('❌ メールサービス接続エラー:', error.message);
      return false;
    }
  }
}

module.exports = EmailService;