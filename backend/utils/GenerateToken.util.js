const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken");

const GenerateToken= (userId)=>{
    const token=  jwt.sign({userId},process.env.JWT_TOKEN,{
        expiresIn:"7d"
    });
     return token
}

module.exports=GenerateToken;