// //backend/utils/sendEmail.js

// import nodemailer from 'nodemailer';

// const requiredEmailEnv = ['EMAIL_USER', 'EMAIL_PASS'];

// const getDefaultHost = () => {
//   const emailUser = process.env.EMAIL_USER || '';
//   if (emailUser.toLowerCase().endsWith('@gmail.com')) return 'smtp.gmail.com';
//   return '';
// };

// const getEmailConfig = () => {
//   const missing = requiredEmailEnv.filter((key) => !process.env[key]);
//   const host = process.env.EMAIL_HOST || getDefaultHost();

//   if (missing.length > 0) {
//     throw new Error(`Email service is not configured. Missing: ${missing.join(', ')}`);
//   }

//   if (!host) {
//     throw new Error('Email service is not configured. Missing: EMAIL_HOST');
//   }

//   const port = Number(process.env.EMAIL_PORT) || 465;
//   const timeout = Number(process.env.EMAIL_TIMEOUT_MS) || 30000;

//   return { host, port, timeout };
// };

// const sendEmail = async ({ to, subject, html }) => {
//   const { host, port, timeout } = getEmailConfig();

//   const transporter = nodemailer.createTransport({
//   host,
//   port,
//   secure: false, // force false for 587
//   connectionTimeout: 5000,  // fail in 5s not 30s
//   greetingTimeout: 5000,
//   socketTimeout: 5000,
//   auth: {
//     user: process.env.EMAIL_USER.trim(),
//     pass: process.env.EMAIL_PASS.replace(/\s+/g, '')
//   }
// });

//   await transporter.sendMail({
//     from: `"MotoGear Pitstop" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html
//   });
// };

// export default sendEmail;





import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  await resend.emails.send({
    from: 'MotoGear Pitstop <onboarding@resend.dev>',
    to,
    subject,
    html
  });
};

export default sendEmail;