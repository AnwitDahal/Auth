require('dotenv').config();
const nodemailer=require('nodemailer')


// console.log('Email:', process.env.EMAIL);
// console.log('Password:', process.env.PASSWORD ? '******' : 'Not set');

module.exports.transporter=nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    secure:false,
    port:587,
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})

