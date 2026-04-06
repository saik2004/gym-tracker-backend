import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "YOUR_EMAIL@gmail.com",
      pass: "YOUR_APP_PASSWORD",
    },
  });

  await transporter.sendMail({
    from: "GYM AI",
    to,
    subject,
    text,
  });
};