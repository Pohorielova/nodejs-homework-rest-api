const nodemailer = require("nodemailer");

require("dotenv").config();
const { EMAIL_PASSWORD } = process.env;
const nodemailConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "anna.pog@meta.ua",
    pass: EMAIL_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: "anna.pog@meta.ua" };
  await transport
    .sendMail(email)
    .then(() => console.log("Email send success"))
    .catch((error) => console.log(error.message));
  return true;
};
module.exports = sendEmail;
// transport
//   .sendMail(email)
//   .then(() => console.log("Email send success"))
//   .catch((error) => console.log(error.message));
