require("dotenv").config();
const express=require("express");
const authRoute=require("./Routes/authRoute.Routes");
const messageRoute=require("./Routes/message.Routes");
const port=process.env.PORT;
const mongoose=require("mongoose");
const cors=require("cors");
const path=require("path");
const cookieParser=require("cookie-parser");
const {server,io,app}=require("./utils/socket");
const db= async ()=> {
    await mongoose.connect(process.env.DB_URL);
    console.log("connected to mongodb")
}

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));  

app.use("/api/auth",authRoute);
app.use("/api/message",messageRoute);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
        
    })
}
server.listen(port,(req,res)=>{
    db();
    console.log(`server running on port${port}`);
})