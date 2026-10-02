// krishi
// app password: fpxi jgre uvqa lzwz


import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `"Admin Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  }); 
};