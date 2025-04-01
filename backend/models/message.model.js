const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const { image } = require("../utils/Cloudinary");

const MessageSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    recieverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    text:{
        type:String,
    },
    image:{
        type:String
    },
},{timestamps:true});

const MessageModel=mongoose.model("message",MessageSchema);
module.exports=MessageModel;