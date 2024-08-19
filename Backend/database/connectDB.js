const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected:${con.connection.host}`);
  } catch (error) {
    console.log("Error!! :" + error.message);
    process.exit(1); //1 is failure
  }
};

module.exports = { connectDB };
