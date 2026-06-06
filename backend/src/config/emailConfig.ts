import nodemailer from "nodemailer";
import {
  SMTP_FROM_EMAIL,
  SMTP_FROM_NAME,
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_USER,
} from "./envConfig.js";
import dns from "node:dns";


const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export const EMAIL_FROM = `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`;

dns.setDefaultResultOrder("ipv4first");
console.log({
  user: SMTP_USER,
  passLength: SMTP_PASSWORD?.length,
});
// transporter
//   .verify()
//   .then(() => {
//     console.log({
//       user: SMTP_USER,
//       passLength: SMTP_PASSWORD?.length,
//     }); console.info("SMTP transporter verified")
//   })
//   .catch((err) => {
//     console.log({
//       user: SMTP_USER,
//       passLength: SMTP_PASSWORD?.length,
//     });
//     console.warn("SMTP verification failed (emails will not send)", {
//       error: err.message,
//     });
//   });

export default transporter;
