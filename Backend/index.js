const express = require("express");
const cookieParser = require('cookie-parser');
require("dotenv").config();
const cors = require('cors');
const path = require('path');
const { connectDB } = require("./database/connectDB");
const authRoutes = require("./routes/auth");
const app = express();
const PORT = process.env.PORT || 5000;

// Declare __dirname only once
const dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`The server is running on port ${PORT}`);
});
