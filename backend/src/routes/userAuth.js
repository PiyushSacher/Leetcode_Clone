const express=require("express");
const authRouter=express.Router();
const {register,login,logout,adminRegister,deleteProfile}=require("../controllers/userAuthenticate");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

authRouter.post("/register",register); // iss route se jo bhi aayega uska role user hi hoga chahe wo admin hi kyu na daalde
authRouter.post("/login",login);
authRouter.post("/logout",userMiddleware,logout);
authRouter.post("/admin/register",adminMiddleware,adminRegister);    // iss route se hum admin ko register krwa skte hai
authRouter.delete("/deleteProfile",userMiddleware,deleteProfile) //if user wants to delete his leetcode profile
//authRouter.get("/getProfile",getProfile);

module.exports=authRouter;