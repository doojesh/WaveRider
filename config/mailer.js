require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Wave Roder" <noreply@waverider.com>`,
      to,
      subject,
      html,
    });
    console.log("Mailtrap email sent");
  } catch (err) {
    console.error("Email failed:", err);
  }
};

module.exports = sendMail;
