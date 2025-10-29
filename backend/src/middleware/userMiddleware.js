const jwt=require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");

const userMiddleware=async(req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token) throw new Error("Invalid token");
        const payload=jwt.verify(token,process.env.JWT_SECRET);

        if (!payload || typeof payload !== "object") throw new Error("Invalid token");
        const {_id}=payload;
    
        if(!_id) throw new Error ("Invalid token");

        const result=await User.findById(_id);
        if(!result) throw new Error("User does not exist");

        // redis ke block list mai present toh nhi hai
        const isBlocked=await redisClient.exists(`token:${token}`);
        if(isBlocked) throw new Error("Invalid Token");

        req.result=result;
        next();

    }catch(e){
        res.status(401).send("Error :"+e);
    }
}

module.exports=userMiddleware;