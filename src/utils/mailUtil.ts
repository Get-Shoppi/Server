import nodemailer from "nodemailer";

function getTransport() {
  return nodemailer.createTransport({
    host: "email-smtp.eu-central-1.amazonaws.com",
    secure: true,
    port: 465,
    auth: {
      user: "AKIA32AKQPJHIX6ECDNH",
      pass: "BKt+fkocX+gHw5ChzPb+jXjKGHkNhBn2UoSs6BjtIaL3",
    },
  });
}

export async function sendLoginMail(email: string, token: string) {
  const webUrl = process.env.WEB_URL as string;
  const transport = getTransport();
  await transport.sendMail({
    to: email,
    from: "noreply@mail.radmacher.club",
    subject: "Shoppi Login",
    text: `Please click on the following link to login: \n
    ${webUrl}/login?token=${token}&email=${email}`,
  });
}
