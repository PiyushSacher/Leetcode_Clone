const mongoose=require("mongoose");
const {Schema}=mongoose;

//index mongodb mai by default bnjaata hai _id ka aur jo field unique:true mark ki hai uska
//ab submission toh 20 crore bhi ho skti hai toh hum koi submission kaise search krenge agar humne koi cheez userId aur problemId ke combo se search krni hai?
//so to achieve this we use compound indexing

//har ek field ko index NHI bnana. This is very bad practice as to make index we need extra memory.
//jis cheez ko hum jyada access kr rhe hai ussi field ko ya uske combo ki hi indexing krni chahiye
const submissionSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    problemId:{
        type:Schema.Types.ObjectId,
        ref:"problem",
        required:true
    },
    code:{
        type:String,
        required:true,
    },
    language:{
        type:String,
        required:true,
        enum:["javascript","c++","java"]
    },
    status:{
        type:String,
        enum:["pending","accepted","wrong","error"],
        default:"pending"
    },
    runtime:{
        type:Number,
        default:0,
    },
    memory:{
        type:Number,
        default:0
    },
    errorMessage:{
        type:String,
        default:" "
    },
    testCasesPassed:{
        type:Number,
        default:0
    },
    testCasesTotal:{
        type:Number,
        default:0
    }
},{
    timestamps:true
});

//To make a compound index: khud koi field ko index dena
//To make an index with the combination of userId and problemId
//1 means ascending order i.e userId and problemId both should be in ascending order
//-1 means descending order
submissionSchema.index({userId:1,problemId:1});


const Submission=mongoose.model("submission",submissionSchema);
module.exports=Submission;

