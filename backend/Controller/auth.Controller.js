const { json } = require("express");
const User=require("../models/User.model");
const bcrypt=require("bcryptjs");
const GenerateToken=require("../utils/GenerateToken.util");
const cloudinary=require("../utils/Cloudinary")

module.exports.signup=async (req,res)=>{
   const {email,password,fullname}=req.body;
  try{
    if(!email || !password || !fullname){
        return res.status(400).json({message:"all fields are required"})
        }
        if(password.length<6){
         return res.status(400).json({message:"password cannot be less than 6 characters"})
        }
        const isuser= await User.findOne({email:email});
     
        if(isuser){
          return res.status(400).json({message:"User already existed"});
        }
     
        const newUser=new User({
         fullname,
         email,
         password
        })
        if(newUser){
         const token=GenerateToken(newUser._id);
         await newUser.save()
         res
           .cookie("jwttoken",token,{
             maxAge:7*24*60*60*1000,
             httpOnly:true,
             sameSite:"lax",
             secure:false
           })
           .status(201)
           .json({message:"user succesfully registered"})
     
        }
        else{
         return res.status(400).json({message:"Error in userData"});
        }     
  }catch(error){
    console.log("error in auth.Controller.js",error);
    res.status(404).json("Internal Server Error");
  }


}

module.exports.login=async (req,res)=>{
    const {email,password}=req.body;
 try{
    if(!email || !password){
        return res.status(400).json({message:"all fields are required"})
        }
        if(password.length<6){
         return res.status(400).json({message:"password cannot be less than 6 characters"})
        }
        const isuser= await User.findOne({email:email});
        if(!isuser){
          return res.status(401).json({message:"invalid credentials"});
        }

        const isPassword=await bcrypt.compare(password,isuser.password);
        if(!isPassword){
            return res.status(401).json({message:"invalid credentiaals"});
        }
        const token=GenerateToken(isuser._id);
        res
          .cookie("jwttoken",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV!=="development"
          })
          .status(200)
          .json(isuser)

 }catch(error){
    console.log("error in auth.Controller.js amd error is:",error);
    res.status(404).json({message:"Internal Server Problem"});
 }
}

module.exports.logout=(req,res)=>{
   try{
    res.cookie("jwttoken","",{maxAge:0});
    res.status(202).json({message:"successfully loged out"})
   }catch(error){
    console.log("error in auth.Controller.js amd error is:",error);
    res.status(404).json({message:"Internal Server Problem"});
   }
}

module.exports.updateProfilePic=async (req,res)=>{
  console.log("tryied for updting profile pic")
    try{
        const {profilePic}=req.body;
        const userId=req.user._id;
        if(!profilePic){
            res.status(400).json({message:"profile pic is required"})
        }
        // console.log(profilePic)
        const uploadResponse= await cloudinary.uploader.upload(profilePic);
        const updatedUser=await User.findByIdAndUpdate(userId,{profilePic: uploadResponse.secure_url},{new:true});
        res.status(202).json(updatedUser);
    }catch(error){
        console.log("error in auth.Controller.js amd error is:",error);
        res.status(404).json({message:"Internal Server Problem"});
    }
}

module.exports.check=async (req,res)=>{
    try{
        res.status(202).json(req.user);
    }
    catch(error){
        console.log("error in auth.Controller.js amd error is:",error);
    res.status(404).json({message:"Internal Server Problem"});
    }
}