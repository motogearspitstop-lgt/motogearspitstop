//backend/utils/sendEmail.js

import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
  const port = Number(process.env.EMAIL_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"MotoGear Pitstop" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

export default sendEmail;
