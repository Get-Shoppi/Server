import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST as string;
const SMTP_PORT = process.env.SMTP_PORT as string;
const SMTP_USER = process.env.SMTP_USER as string;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD as string;
const SMTP_FROM = process.env.SMTP_FROM as string;

function getTransport() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    secure: true,
    port: Number(SMTP_PORT),
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });
}

export async function sendLoginMail(email: string, token: string) {
  const webUrl = process.env.WEB_URL as string;
  const transport = getTransport();
  await transport.sendMail({
    to: email,
    from: SMTP_FROM,
    subject: "Shoppi Login",
    text: `Please click on the following link to login: \n
    ${webUrl}/login?token=${token}&email=${email}`,
  });
}
