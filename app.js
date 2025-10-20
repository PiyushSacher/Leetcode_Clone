const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const cookieParser=require("cookie-parser")
const User=require("./src/models/user")
dotenv.config();

app.use(express.json());
app.use(cookieParser());

connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Server listening at port : "+process.env.PORT)
    })
}).catch((err)=>{
    console.log("ERROR : "+err)
});

