const express=require("express");
const ProblemRouter=express.Router();

ProblemRouter.post("/create",problemCreate);
ProblemRouter.get("/:id",problemFetch);
ProblemRouter.get("/",getAllProblems);
ProblemRouter.patch("/:id",problemUpdate);
ProblemRouter.delete("/:id",problemDelete);
ProblemRouter.get("/user",SolvedProblem);




