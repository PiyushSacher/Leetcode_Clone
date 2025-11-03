const express=require("express");
const app=express();
const User = require("../models/user");
const validate = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");
const Submission = require("../models/submission");

app.use(express.json());

//once if user registers we will generate a token in this api only and send the token to the user
const register = async (req, res) => {
  try {
    //validate the data
    validate(req.body);
    const { firstName, emailId, password } = req.body;
    req.body.password = await bcrypt.hash(password, 10);
    req.body.role="user";

    const user = await User.create(req.body);

    const token = jwt.sign(   //payload
      {_id: user._id, emailId: emailId ,role:"user"},
      process.env.JWT_SECRET,
      { expiresIn: 3600 }
    );

    const reply={
      firstName:user.firstName,
      emailId:user.emailId,
      _id:user._id,
      role:user.role,
    }
    res.cookie("token", token, { maxAge: 3600000 }); //maxAge is in millisecond
    res.status(201).json({
      user:reply,
      message:"User Registered Successfully"
    })

  } catch (err) {
    console.log("ERROR: " + err);
    res.status(400).send("ERROR: " + err);
  }
};

const login = async (req,res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId) throw new Error("Invalid Credentials");
    if (!password) throw new Error("Invalid Credentials");

    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid Credentials");

    const reply={
      firstName:user.firstName,
      emailId:user.emailId,
      _id:user._id,
      role:user.role,
    }

    const token = jwt.sign(
      { _id: user._id, emailId: emailId ,role:user.role},      //payload
      process.env.JWT_SECRET,
      { expiresIn: 3600 }
    );
    res.cookie("token", token, { maxAge: 3600000 }); //maxAge is in millisecond
    res.status(201).json({
      user:reply,
      message:"Login Successfully"
    })
  } catch (err) {
    res.status(401).send("Error "+err);
  }
};

const logout=async(req,res)=>{
    try{
      const {token}=req.cookies;
      const payload=jwt.decode(token);
      await redisClient.set(`token:${token}`,"blocked");
      // @ts-ignore
      await redisClient.expireAt(`token:${token}`,payload.exp);
      res.cookie("token",null,{expires: new Date(Date.now())});
      res.send("Logout Successful");
        
    } catch (err) {
      res.status(503).send("Error "+err);
    }
};

const adminRegister=async(req,res)=>{
  try {
    //validate the data
    validate(req.body);
    const { firstName, emailId, password } = req.body;
    req.body.password = await bcrypt.hash(password, 10);
    

    const user = await User.create(req.body);

    const token = jwt.sign(   //payload
      {_id: user._id, emailId: emailId ,role:user.role},
      process.env.JWT_SECRET,
      { expiresIn: 3600 }
    );
    res.cookie("token", token), { maxAge: 3600000 }; //maxAge is in millisecond
    res.status(201).send("User registered successfully");
  } catch (err) {
    console.log("ERROR: " + err);
    res.status(400).send("ERROR: " + err);
  }
}

const deleteProfile=async(req,res)=>{
  try{
    const userId=req.result._id;

    //delete user from userSchema
    await User.findByIdAndDelete(userId);

    //delete user from submissionSchema
    await Submission.deleteMany({userId});  //as there can be many submissions by the user , therefore we used deleteMany
    res.status(200).send("Deleted Successfully");
  }catch(err){
    res.status(400).send("ERROR: " + err);
  }
}

module.exports={register,login,logout,adminRegister,deleteProfile};


