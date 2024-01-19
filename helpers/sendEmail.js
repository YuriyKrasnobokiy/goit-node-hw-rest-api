import nodemailer from "nodemailer";
import "dotenv/config";

const { UKRNET_PASSWORD, UKRNET_FROM } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465, // 25, 465, 2525
  decure: true,
  auth: {
    user: UKRNET_FROM,
    pass: UKRNET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: UKRNET_FROM };
  await transport.sendMail(email);
  return true;
};

export default sendEmail;
