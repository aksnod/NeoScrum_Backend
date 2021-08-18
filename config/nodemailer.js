const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: 'shyamwinner18@gmail.com',
    pass: 'Shyamwinner@108',
  },
});

module.exports = transporter;
