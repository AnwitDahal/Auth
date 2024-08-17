const jwt=require('jsonwebtoken')

module.exports.generateTokenAndSetCookie=(res,userId)=>{
    const token =jwt.sign({userId},process.env.JWT_SECRET,
    {
        expiresIn:'10d'
    })

    res.cookie('token',token,{
        httpOnly:true, //XSS attack prevention
        secure:process.env.NODE_ENV==='production',
        samesite:"strict", //CSRF attack prevention
        maxAge: 10*24*60*60*1000
    })

    return token;
}