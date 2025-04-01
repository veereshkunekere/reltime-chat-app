const socket =require("socket.io");
const http =require("http");
const express=require("express");

const app=express();

const server=http.createServer(app);

const io=new socket.Server(server,{
    cors:["http://localhost:5173"]
});

const userSocketmap={};//userId:socket.id

const getRecieverSocketId=(userId)=>{
    return userSocketmap[userId];
}
// module.exports= {getRecieverSocketId};
io.on("connection",(socket)=>{
    console.log("A user is connected",socket.id);
    const userId=socket.handshake.query.userId;
    if(userId) userSocketmap[userId]=socket.id;
    //io.emmit sends events to all connected users
    io.emit("getOnlineUsers",Object.keys(userSocketmap));
    socket.on("disconnect",()=>{
        console.log("A user is disconnected",socket.id);
        delete userSocketmap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketmap));
    })
})
module.exports= {io,server,app,getRecieverSocketId};