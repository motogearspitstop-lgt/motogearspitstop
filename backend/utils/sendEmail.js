// utils/sendEmail.js


import { Resend } from 'resend';

const sendEmail = async ({ to, subject, html }) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  const { data, error } = await resend.emails.send({
from: 'MotoGear Pitstop <noreply@motogearspitstop.com>',
    to,
    subject,
    html
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error(error.message);
  }

  console.log('Email sent successfully:', data?.id);
};

export default sendEmail;