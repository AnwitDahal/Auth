const {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} = require("./emailTemplate");
const { transporter } = require("./nodemailerconfig");

module.exports.sendVerificationEmail = async (email, verificationToken) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    });
    console.log("Email send successfully", response);
  } catch (err) {
    console.error(`Error sending verification`, err);
    throw new Error(`Error sending verification email:${err}`);
  }
};

module.exports.sendWelcomeEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to our App",
      html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
    });
    console.log("Welcome Email send successfully", response);
  } catch (err) {
    console.error(`Error sending verification`, err);
    throw new Error(`Error sending verification email:${err}`);
  }
};

module.exports.sendForgotPasswordEmail = async (email, resetURL) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password Email",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });
    console.log("Reset Password Email send successfully", response);
  } catch (err) {
    console.error(`Error sending password reset email`, err);
    throw new Error(`Error sending password reset email:${err}`);
  }
};

module.exports.sendResetPasswordSuccessfullEmail= async (email) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
    console.log("Password Reset Email send successfully", response);
  } catch (err) {
    console.error(`Error sending password reset success email`, err);
    throw new Error(`Error sending password reset success email:${err}`);
  }
};
