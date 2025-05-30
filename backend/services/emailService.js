require("dotenv").config();
const nodemailer = require("nodemailer");

// Configure com seu e-mail real em produção!
const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: process.env.EMAIL_SMARTKIDS,
    pass: process.env.EMAIL_SMARTKIDS_PASS
  }
});

async function sendPaymentNotification(to, subject, text) {
  await transporter.sendMail({
    from: '"SmartKids" <seuemail@gmail.com>',
    to,
    subject,
    text
  });
}

module.exports = { sendPaymentNotification };