const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const fromEmail = process.env.FROM_EMAIL;

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: fromEmail,
    subject: "Account created successfully",
    text: `Welcome to the app ${name}`,
  });
};

module.exports = {
  sendWelcomeEmail,
};
