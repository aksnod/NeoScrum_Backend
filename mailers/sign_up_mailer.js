const nodeMailer = require("../config/nodemailer");

module.exports.signUpMailer = (password, mailId) => {
  nodeMailer.sendMail(
    {
      from: "shyamwinner18@gmail.com",
      to: "shyamwinner18@gmail.com",
      subject: "Login Credentials",
      html:
        "<h3>Successfully register </h3></br><p>email is: " +
        mailId +
        "</br> password is: " +
        password +
        "</p></br>  visit url for login </br> <a>http://localhost:8000/api/user/create-session</a>",
    },
    (err, info) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("mail send successfully");
    }
  );
};
