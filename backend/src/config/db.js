const mongoose=require("mongoose");

async function connectDB(){
    await mongoose.connect(process.env.CONNECTION_STRING);
}

module.exports=connectDB;
    
