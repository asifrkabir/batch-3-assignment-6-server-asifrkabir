import nodemailer from "nodemailer";
import config from "../config";

export const sendResetPasswordEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.NODE_ENV === "production",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: config.nodemailer_email,
      pass: config.nodemailer_password,
    },
  });

  await transporter.sendMail({
    from: config.nodemailer_email, // sender address
    to, // list of receivers
    subject: "Reset Password | Pawfect", // Subject line
    text: "Reset your password within 10 minutes.", // plain text body
    html, // html body
  });
};
