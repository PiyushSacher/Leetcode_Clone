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
const ProblemRouter=require("./src/routes/problemCreator");
const {submitRouter}=require("./src/routes/submit");
const cors=require("cors");

app.use(cors({
    origin:"http://localhost:5173",  //this ip is allowed
    credentials:true   
}));

app.use(express.json());
app.use(cookieParser());

app.use("/user",authRouter);
app.use("/problem",ProblemRouter);
app.use("/submission",submitRouter);

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

