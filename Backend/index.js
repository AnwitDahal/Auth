const express = require("express");
const cookieParser=require('cookie-parser')
require("dotenv").config();
const { connectDB } = require("./database/connectDB");
const authRoutes = require("./routes/auth");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`The server is running in the port:${PORT}`);
});
