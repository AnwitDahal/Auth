const express=require('express');
const { signup, login, logout } = require('../controller/authController');
const router=express.Router();

router.get('/signup',signup)
router.get('/login',login)
router.get('/logout',logout)

module.exports=router;