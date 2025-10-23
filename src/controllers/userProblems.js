const {getLangById,submitBatch}=require("../utils/problemUtility");

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
            const submissions=visibleTestCases.map((input,output)=>{
                source_code:completeCode;
                language_id:languageId;
                stdin:input;
                expected_output:output;
            });

            const submitResult=await submitBatch(submissions);
        }

    }catch(err){
        console.log(err);

    }
    

}