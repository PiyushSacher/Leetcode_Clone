const express=require("express");
const ProblemRouter=express.Router();
const adminMiddleware=require("../middleware/adminMiddleware");
const {createProblem}=require("../controllers/userProblems")

//these api's can be accessed only by admin
ProblemRouter.post("/create",adminMiddleware,createProblem);
//ProblemRouter.patch("/:id",adminMiddleware,updateProblem);
//ProblemRouter.delete("/:id",adminMiddleware,deleteProblem);

//these api's can be accessed by anyone
//ProblemRouter.get("/:id",getProblemById);
//ProblemRouter.get("/",getAllProblems);
//ProblemRouter.get("/user",solvedProblem);

module.exports=ProblemRouter;




