const route=require("express").Router();
const Controller=require("../Controller/message.Controller");
const protectRoute=require("../middelware/auth.middelware");

route.get("/users",protectRoute,Controller.getUserForSidebar)
route.get("/:id",protectRoute,Controller.getMessages);
route.post("/send/:id",protectRoute,Controller.sendMessage)
module.exports=route;