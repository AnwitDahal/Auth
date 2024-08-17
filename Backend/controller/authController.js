const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

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

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const verifyCode=generateVerifyCode();
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
  res.send("signup");
};

module.exports.login = async (req, res) => {
  res.send("login");
};

module.exports.logout = async (req, res) => {
  res.send("logout");
};
