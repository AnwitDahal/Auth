const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateVerifyCode } = require("../utils/generateVerifyCode");
const {
  generateTokenAndSetCookie,
} = require("../utils/generateTokenAndSetCookie");
const { sendVerificationEmail, sendWelcomeEmail } = require("../nodemailer/emails");

module.exports.signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await userModel.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    //password hashing
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    //generating otp for verification
    const verificationToken = generateVerifyCode();

    const user = new userModel({
      email,
      password: hash,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 hours
    });

    await user.save();

    //jwt
    generateTokenAndSetCookie(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created succesfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports.verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await userModel.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expiredVerification Code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      sucess:true,
      message:"Email verified successfully",
      user:{
        ...user._doc,
        password:undefined,

      }
    })
  } catch (error) {
    console.log("error in verifyEmail",error);
    res.status(500).json({
      success:false,
      message:`Server Error`    
    })
  }
};

module.exports.login = async (req, res) => {
  res.send("login");
};

module.exports.logout = async (req, res) => {
  res.send("logout");
};
