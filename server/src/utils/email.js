const nodemailer = require('nodemailer');
const logger = require('./logger');

let transporter = null;
function getTransport() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  return transporter;
}

exports.sendMail = async ({ to, subject, html, text }) => {
  const t = getTransport();
  if (!t) { logger.warn(`[email skipped] ${subject} -> ${to}`); return; }
  await t.sendMail({ from: process.env.SMTP_FROM || 'no-reply@devplatform.io', to, subject, html, text });
};
