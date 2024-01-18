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

// const data = {
//   to: "jehinod755@grassdev.com",
//   subject: "Test email",
//   html: "<strong>Test email</strong>",
// };

// transport
//   .sendMail(email)
//   .then(() => console.log("Email send success"))
//   .catch((error) => console.log(error.message));

const sendEmail = (data) => {
  const email = { ...data, from: UKRNET_FROM };
  return transport.sendEmail(email);
};

export default sendEmail;
