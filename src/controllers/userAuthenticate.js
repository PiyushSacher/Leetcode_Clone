const User = require("../models/user");
const validate = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//once if user registers we will generate a token in this api only and send the token to the user
const register = async (req, res) => {
  try {
    //validate the data
    validate(req.body);
    const { firstName, emailId, password } = req.body;
    req.body.password = await bcrypt.hash(password, 10);

    const user = await User.create(req.body);

    const token = jwt.sign(
      { _id: user._id, emailId: emailId },
      process.env.JWT_SECRET,
      { expiresIn: 3600 }
    );
    res.cookie("token", token), { maxAge: 3600000 }; //maxAge is in millisecond
    res.status(201).send("User registered successfully");
  } catch (err) {
    console.log("ERROR: " + err);
    res.status(400).send("ERROR: " + err);
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId) throw new Error("Invalid Credentials");
    if (!password) throw new Error("Invalid Credentials");

    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid Credentials");

    const token = jwt.sign(
      { _id: user._id, emailId: emailId },      //payload
      process.env.JWT_SECRET,
      { expiresIn: 3600 }
    );
    res.cookie("token", token), { maxAge: 3600000 }; //maxAge is in millisecond
    res.status(200).send("Logged In Successfully");
  } catch (err) {
    res.status(401).send("Error "+err);
  }
};

const logout=async(req,res)=>{
    try{
        

    } catch (err) {
        res.status(401).send("Error "+err);
    }
};


