const express=require("express");
const ProblemRouter=express.Router();
const adminMiddleware=require("../middleware/adminMiddleware");
const userMiddleware=require("../middleware/userMiddleware");
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblems,solvedProblembyUser}=require("../controllers/userProblems")

//these api's can be accessed only by admin
ProblemRouter.post("/create",adminMiddleware,createProblem);
ProblemRouter.put("/update/:id",adminMiddleware,updateProblem);
ProblemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);

//these api's can be accessed by anyone
ProblemRouter.get("/problemById/:id",userMiddleware,getProblemById);
ProblemRouter.get("/getAllProblem",userMiddleware,getAllProblems);
ProblemRouter.get("/problemSolvedByUser",userMiddleware,solvedProblembyUser);

module.exports=ProblemRouter;




