const mongoose=require("mongoose");
const bcrypt=require("bcryptjs")

const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:[6,"password cannot be less than 6"]
    },
    profilePic:{
        type:String,
        default:""
    }
},
{timestamps:true});

// const salt=bcrypt.genSalt(10);
// const hassPassword=bcrypt.hash(pa)

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Only hash if password is modified
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });
  

const UserModel=mongoose.model("user",UserSchema);
module.exports=UserModel;