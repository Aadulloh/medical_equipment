const nodemailer = require("nodemailer");
const config = require("config");

class MailService {
  constructor(parameters) {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.get("smtp_host"),
      port: config.get("smtp_port"),
      secure: false,
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_password"),
      },
    });
  }

  async sendActivationMail(toEmail, name) {
    await this.transporter.sendMail({
      from: config.get("smtp_user"),
      to: toEmail,
      subject: "Medical equipment",
      html: `
        <div>
            <h3>Welcome back 😊</h3>
            <h3>${name} your accaunt is active now !</h3>
        </div>
            `,
    });
  }
}

module.exports = new MailService();
