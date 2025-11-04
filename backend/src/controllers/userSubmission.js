const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const {
  getLangById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");

const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    if (!userId || !code || !problemId || !language)
      return res.status(400).json({ status: "error", message: "Some field missing" });

    // --- FIX 1: CHECK IF PROBLEM EXISTS ---
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ status: "error", message: "Problem not found" });
    }

    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesTotal: problem.hiddenTestCases.length,
    });

    const languageId = getLangById(language);
    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "accepted"; // Assume success until proven otherwise
    let errorMessage = null;

    // --- FIX 2: ROBUST JUDGE0 STATUS CHECKING ---
    for (const test of testResult) {
      switch (test.status_id) {
        case 3: // Accepted
          testCasesPassed++;
          runtime += parseFloat(test.time);
          memory = Math.max(memory, test.memory);
          break;
        
        case 4: // Wrong Answer
          status = "wrong";
          errorMessage = `Wrong Answer. \nExpected: ${test.expected_output}\nGot: ${test.stdout}`;
          break;

        case 5: // Time Limit Exceeded
          status = "error";
          errorMessage = `Time Limit Exceeded (${test.time}s)`;
          break;

        case 6: // Compilation Error
          status = "error";
          errorMessage = test.compile_output || "Compilation Error";
          break;

        default: // Runtime Error, etc.
          status = "error";
          errorMessage = test.stderr || test.status.description || "Runtime Error";
          break;
      }
      
      if (status !== "accepted") {
        break; // Stop checking on first failure
      }
    }

    // Store the final result in the submission document
    // @ts-ignore
    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;
    
    await submittedResult.save();
    
    // --- FIX 3: ONLY UPDATE problemSolved IF ACCEPTED ---
    if (status === "accepted") {
      const user = await User.findById(userId); // Re-fetch user to be safe
      if (!user.problemSolved.includes(problemId)) {
        user.problemSolved.push(problemId);
        await user.save();
      }
    }

    res.status(201).json(submittedResult);

  } catch (err) {
    res.status(500).json({ status: "error", message: "Server Error: " + err.message });
  }
};

const runCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    if (!userId || !code || !problemId || !language)
      return res.status(400).json({ status: "error", message: "Some field missing" });

    // --- FIX 1: CHECK IF PROBLEM EXISTS ---
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ status: "error", message: "Problem not found" });
    }

    const languageId = getLangById(language);
    
    // Use visibleTestCases for run
    const submissions = problem.visibleTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);

    // Frontend handles the raw result, so just send it
    res.status(201).json(testResult);
  } catch (err) {
    res.status(500).json({ status: "error", message: "Server Error: " + err.message });
  }
};

module.exports = { submitCode, runCode };
