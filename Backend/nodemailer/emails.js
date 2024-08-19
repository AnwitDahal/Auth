const { VERIFICATION_EMAIL_TEMPLATE } = require("./emailTemplate");
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
