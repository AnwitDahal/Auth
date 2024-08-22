const express = require("express");
const cookieParser=require('cookie-parser')
require("dotenv").config();
const cors=require('cors')
const { connectDB } = require("./database/connectDB");
const authRoutes = require("./routes/auth");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({origin:"http://localhost:5173", credentials:true}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`The server is running in the port:${PORT}`);
});
