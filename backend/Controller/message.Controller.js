const User=require("../models/User.model");
const Message=require("../models/message.model");
const cloudinary=require("../utils/Cloudinary");
// const {io} =require("socket.io");
const {getRecieverSocketId,io}=require("../utils/socket");
module.exports.getUserForSidebar=async (req,res)=>{
  try{
    const loggedInuser=req.user._id;
    const filteredUsers=await User.find({_id:{$ne:loggedInuser}}).select("-password");
    res.status(202).json(filteredUsers);
  }catch(error){
    console.log("error in message.Controller.js amd error is:",error);
    res.status(404).json({message:"Internal Server Problem"});
  }

}

module.exports.getMessages=async (req,res)=>{
 try{
    const {id:userToChat}=req.params ;
    const myId=req.user._id;
  
    const messages=await Message.find({
      $or:[
          {senderId:myId, recieverId:userToChat},
          {senderId:userToChat, recieverId:myId}
    ]});
  
    res.status(200).json(messages);  
 }catch(error){
    console.log("error in message.Controller.js amd error is:",error);
    res.status(404).json({message:"Internal Server Problem"});
 }
}

module.exports.sendMessage=async(req,res)=>{
    try{
        const {text,image}=req.body;
    const {id:userTochat}=req.params;
    const myId=req.user._id;
    let ImageUrl;
    if(image){
        const uploadMessage=cloudinary.uploader.upload(image);
        ImageUrl=(await uploadMessage).secure_url;
    };
    const newMessage=new Message({
        senderId:myId,
        recieverId:userTochat,
        text:text,
        image:ImageUrl
    });
    await newMessage.save();
    const recieverId=getRecieverSocketId(userTochat);
    //todo:realtime functionality using socketio
     io.to(recieverId).emit("newMessage",newMessage);
    res.status(202).json(newMessage);

    }catch(error){
        console.log("error in message.Controller.js amd error is:",error);
        res.status(404).json({message:"Internal Server Problem"});
    }

}