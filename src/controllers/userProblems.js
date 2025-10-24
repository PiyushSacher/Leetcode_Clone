// @ts-nocheck
const {getLangById,submitBatch,submitToken}=require("../utils/problemUtility");
const Problem=require("../models/problem");

const createProblem=async(req,res)=>{
    const {title,description,difficulty,tags,visibleTestCases,hiddenTestCases,starterCode,referenceSolution,problemCreator}=req.body;

    try{
        for(const {language,completeCode} of referenceSolution){
            //source_code
            //language_id
            //stdin
            //expectedOutput

            const languageId=getLangById(language);

            //expected input for judge0 ,see the documentation for batch submission
            const submissions=visibleTestCases.map((testcase)=>({
                // @ts-ignore
                source_code:completeCode,
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
        res.status(400).send("Error brother "+err);
    }
}

module.exports={createProblem};