const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "mateuszaplikacjewebowe@gmail.com",
    pass: "iill hzfj zsyc uvrp",
  },
});

const sendForgotPasswordEmail = (email, link) => {
  const mailOptions = {
    from: "mateuszaplikacjewebowe@gmail.com",
    to: `${email}`,
    subject: "Photo Gallery - reset password",
    text: `Click here to reset your password: ${link}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred while sending email:", error);
    } else {
      console.log("Email sent successfully!", info.response);
    }
  });
};
// sendForgotPasswordEmail(mailOptions);
module.exports = {
  sendForgotPasswordEmail,
};
