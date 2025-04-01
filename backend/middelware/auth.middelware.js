const jwt =require("jsonwebtoken");
const User=require("../models/User.model");
const protectRoute=async (req,res,next)=>{
   try{
    const token=req.cookies.jwttoken;
    if(!token){
       return res.status(401).json({message:"Unauthorized User"})
    }
    const decode=jwt.verify(token,process.env.JWT_TOKEN);
    if(!decode){
        return res.status(401).json({message:"Unauthorized User"})
    }
    const user=await User.findById(decode.userId).select("-password");
    if(!user){
        return res.status(401).json({message:"Unauthorized User"})
    }
    req.user=user
    next();
   }catch(error){
    console.log("Error in protectRoute middleware:", error);
    res.status(401).json({ message: "Unauthorized User" });
   }
}

module.exports=protectRoute;