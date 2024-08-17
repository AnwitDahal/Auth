const express=require('express');
require('dotenv').config();
const { connectDB } = require('./database/connectDB');
const authRoutes=require('./routes/auth')
const app=express();
const PORT=process.env.PORT || 5000;

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/auth",authRoutes)

app.listen(PORT,()=>{
    connectDB();
    console.log(`The server is running in the port:${PORT}`)
})
