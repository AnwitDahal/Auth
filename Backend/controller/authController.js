const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto=require('crypto')
const { generateVerifyCode } = require("../utils/generateVerifyCode");
const {
  generateTokenAndSetCookie,
} = require("../utils/generateTokenAndSetCookie");
const { sendVerificationEmail, sendWelcomeEmail, sendForgotPasswordEmail } = require("../nodemailer/emails");

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
  const {email,password}=req.body;
  try {
    const user = await userModel.findOne({email})
    
    if(!user){
      return res.status(400).json({
        success:false,
        message:"Invalid Email or Password"
      })
    }

    const passwordValidation=bcrypt.compareSync(password, user.password);
    if(!passwordValidation){
      return res.status(400).json({
        success:false,
        message:"Invalid Email or Password"
      })
    }
    generateTokenAndSetCookie(res,user._id)

    user.lastLogin= new Date();
    await user.save();

    return res.status(200).json({
      success:true,
      message:"LoggedIn Successfully",
      user:{
        ...user._doc,
        password:undefined,
      },
    })
  } catch (err) {
    console.log("Error in Login !:",err);
    res.status(400).json({
      success:false,
      message:err.message
    })
  }
};

module.exports.logout = async (req, res) => {
  res.clearCookie('token')
  res.status(200).json({
    success:true,
    message:"Logged Out Successfully"
  })
};

module.exports.forgotPassword=async(req,res)=>{
  const {email}=req.body;
  try {
    const user=await userModel.findOne({email})
    if (!user){
      return res.status(400).json({
        success:false,
        message:"Email not found"
      })
    }

    //generating reset token
    const resetToken=crypto.randomBytes(20).toString('hex');
    const resetTokenExpires=Date.now()+ 1*60*60*1000  //1 hrs

    user.resetPasswordToken=resetToken;
    user.resetPasswordExpiresAt=resetTokenExpires;

    await user.save();
    await sendForgotPasswordEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);

    res.status(400).json({
      success:true,
      message:"Password reset link sent to your email"
    })
  } catch (error) {
    console.log("Error in forgotPassword :",error);
    res.status(400).json({
      success:false,
      message:error.message
    })
  }
}