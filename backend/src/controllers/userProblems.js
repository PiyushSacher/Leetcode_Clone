// @ts-nocheck
const {getLangById,submitBatch,submitToken}=require("../utils/problemUtility");
const Problem=require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");
const solutionVideo=require("../models/solutionVideo");

const createProblem=async(req,res)=>{
    const {title,description,difficulty,tags,visibleTestCases,hiddenTestCases,starterCode,referenceSolution,problemCreator}=req.body;

    try{
        //console.log("🟡 Received body:", req.body);
        for(const {language,completeCode} of referenceSolution){
            //source_code
            //language_id
            //stdin
            //expectedOutput

            const languageId=getLangById(language);

            //expected input for judge0 ,see the documentation for batch submission
            const submissions=visibleTestCases.map((testcase)=>({
                // @ts-ignore
                source_code:completeCode.replace(/\\n/g, "\n"),
                language_id:languageId,
                stdin:testcase.input,
                expected_output:testcase.output,
            }));

            //submitResult is array of tokens 
            const submitResult=await submitBatch(submissions);
            const resultToken=submitResult.map((value)=>value.token);
            const testResult=await submitToken(resultToken);
            // console.log(testResult);
            // console.log(submitResult);

            for(const test of testResult){
                if(test.status_id==4) return res.status(400).send("Wrong Answer");
                if(test.status_id==5) return res.status(400).send("Time Limit Exceeded");
                if(test.status_id==6) return res.status(400).send("Compilation Error");
                if(test.status_id>=7) return res.status(400).send("Runtime Error");
            }
        }
        
        //we can store it in our db
        const userProblem=await Problem.create({
            ...req.body,
            problemCreator:req.result._id,
        })

        res.status(201).send("Problem saved successfully");
        

    }catch(err){
        //.log("Received body:", req.body);
        console.error("Error creating problem:", err.message);
        res.status(500).send("Error brother "+err);
        
    }
}

const updateProblem=async(req,res)=>{
    
    try{
        const {id}=req.params;
        if(!id) return res.status(400).send("Invalid id field");

        const dsaProblem=await Problem.findById(id);

        if(!dsaProblem) return res.status(404).send("ID is not present");
        const {title,description,difficulty,tags,visibleTestCases,hiddenTestCases,starterCode,referenceSolution,problemCreator}=req.body;
        for(const {language,completeCode} of referenceSolution){
            //source_code
            //language_id
            //stdin
            //expectedOutput

            const languageId=getLangById(language);

            //expected input for judge0 ,see the documentation for batch submission
            const submissions=visibleTestCases.map((testcase)=>({
                // @ts-ignore
                source_code:completeCode.replace(/\\n/g, "\n"),
                language_id:languageId,
                stdin:testcase.input,
                expected_output:testcase.output,
            }));

            //submitResult is array of tokens 
            const submitResult=await submitBatch(submissions);
            const resultToken=submitResult.map((value)=>value.token);
            const testResult=await submitToken(resultToken);
            // console.log(testResult);
            // console.log(submitResult);

            for(const test of testResult){
                if(test.status_id==4) return res.status(400).send("Wrong Answer");
                if(test.status_id==5) return res.status(400).send("Time Limit Exceeded");
                if(test.status_id==6) return res.status(400).send("Compilation Error");
                if(test.status_id>=7) return res.status(400).send("Runtime Error");
            }
        }

        const newProblem=await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true, new:true});
        //new:true mtlb jab document update hojayega , toh jo updated document hai mujhe usko return krke dena

        res.status(200).send(newProblem);
    }catch(e){
        res.status(500).send("Errorrr: "+e);
    }
}

const deleteProblem=async(req,res)=>{
    try{
        const {id}=req.params;
        if(!id) return res.status(400).send("Invalid id field");

        const deletedProblem=await Problem.findByIdAndDelete(id);
        if(!deleteProblem) return res.status(404).send("Problem is missing");

        res.status(200).send("Problem deleted successfully");

    }catch(err){
        res.status(500).send("Errorrr: "+err);
    }
}


const getProblemById=async(req,res)=>{
    try{
        const {id}=req.params;
        if(!id) return res.status(400).send("Invalid id field");

        //now we dont want to send everything to the user, like hidden test cases and more fields,
        //so for that we have a function known as select and we pass the things which we want to send.
        const getProblem=await Problem.findById(id).select("_id title description difficulty tags visibleTestCases startCode referenceSolution"); 
        
        if(!getProblem) return res.status(404).send("Problem is missing");

        //video ka url bhi yaha se bhejdo
        const videos=await solutionVideo.findOne({problemId:id});
        if(videos){
            const responseData={
                ...getProblem.toObject(),
                secureUrl:videos.secureUrl,
                thumbnailUrl:videos.thumbnailUrl,
                duration:videos.duration
            }
            return res.status(200).send(responseData);
            
        }
        res.status(200).send(getProblem);

    }catch(err){
        res.status(500).send("Errorrr: "+err);
    }
}

const getAllProblems=async(req,res)=>{
    try{
        //same here :   .select
        const getProblemss=await Problem.find({}).select("_id title difficulty tags");
        if(getProblemss.length===0) return res.status(404).send("No problems available");

        res.status(200).send(getProblemss);
    }catch(err){
        res.status(500).send("Errorrr: "+err);
    }
}

const solvedProblembyUser=async(req,res)=>{
    try{
        const userId=req.result._id;
        
        //humne jo problemSolved mai problemId store krwayi thi usko hum .populate krenge mtlb uss id ke corresponding saari info layenge problem schema se
        //.populate means jisko ref kr rha hai wo pura object le aao aur problemSolved mai show krna
        const user=await User.findById(userId).populate({
            path:"problemSolved",
            select:"_id title difficulty tags"
        });
        res.status(200).send(user.problemSolved);
    }catch(err){
        res.status(500).send("Errorrr: "+err);
    }
};

const submittedProblem=async(req,res)=>{
    try{
        const userId=req.result._id;
        const problemId=req.params.pid;

        const ans=await Submission.find({userId,problemId});
        if(ans.length===0) return res.status(200).send("No submissions present");
        res.status(200).send(ans);
    }catch(err){
        res.status(500).send("Errorrr: "+err);
    }
}

module.exports={createProblem,updateProblem,deleteProblem,getProblemById,getAllProblems,solvedProblembyUser,submittedProblem};