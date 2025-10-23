const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./src/config/db");
const cookieParser=require("cookie-parser")
const User=require("./src/models/user")
const authRouter=require("./src/routes/userAuth");
const redisClient = require("./src/config/redis");
const adminMiddleware=require("./src/middleware/adminMiddleware");

app.use(express.json());
app.use(cookieParser());

app.use("/user",authRouter);

const InitializeConnection=async()=>{
    try{
        await Promise.all([connectDB(),redisClient.connect()]);
        console.log("DB's Connected");

        app.listen(process.env.PORT,()=>{
        console.log("Server listening at port : "+process.env.PORT)
        });

    }catch(err){
        console.log("ERROR :" +err)
    }
}
InitializeConnection();

// connectDB()
// .then(()=>{
//     app.listen(process.env.PORT,()=>{
//         console.log("Server listening at port : "+process.env.PORT)
//     })
// }).catch((err)=>{
//     console.log("ERROR : "+err)
// });

