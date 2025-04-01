const route=require("express").Router();
const Controller=require("../Controller/auth.Controller");
const protectRoute=require("../middelware/auth.middelware");
route.post("/signup",Controller.signup)

route.post("/login",Controller.login)

route.post("/logout",Controller.logout);

route.put("/update-profile-pic",protectRoute,Controller.updateProfilePic);

route.get("/check",protectRoute,Controller.check);

module.exports=route;