/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { useParams, NavLink } from "react-router";
import axiosClient from "../utils/axiosClient";
import { useSelector, useDispatch } from "react-redux";
import SubmissionHistory from "./SubmissionHistory";
import ChatAI from "./ChatAI";
import Editorial from "./Editorial";

const langMap = {
  cpp: "C++",
  java: "Java",
  javascript: "JavaScript",
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Used for run/submit loading state
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeBottomTab, setActiveBottomTab] = useState("testcases");

  const editorRef = useRef(null);
  let { problemId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { handleSubmit } = useForm();

  // Fetch problem details on load
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        // Calls GET /problem/problemById/:id
        const { data } = await axiosClient.get(
          `/problem/problemById/${problemId}`
        );
        setProblem(data);

        // Set starter code based on fetched data
        const starter = data?.starterCode?.find(
          (s) => s.language.toLowerCase() === selectedLanguage.toLowerCase()
        )?.initialCode;
        setCode(starter || `// No starter code for ${selectedLanguage}`);
      } catch (error) {
        console.error("Error fetching problem:", error);
        setProblem(null);
      }
      setLoading(false);
    };
    fetchProblem();
  }, [problemId]);

  // Update code in editor when language changes
  useEffect(() => {
    if (problem) {
      const starter = problem?.starterCode?.find(
        (s) => s.language.toLowerCase() === selectedLanguage.toLowerCase()
      )?.initialCode;
      setCode(starter || `// No starter code for ${selectedLanguage}`);
    }
  }, [selectedLanguage, problem]);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  const onRun = async () => {
    setIsSubmitting(true);
    setActiveBottomTab("result");
    setRunResult(null);
    setSubmitResult(null);
    try {
      // FIX: Calls POST /submission/run/:id (Uses correct mount point)
      const { data } = await axiosClient.post(`/submission/run/${problemId}`, {
        code: code,
        language: selectedLanguage,
      });
      // 'data' from runCode is the raw Judge0 result array
      setRunResult({ status: "success", output: data });
    } catch (error) {
      // Robust error handling for server/API errors
      const errorMessage =
        error.response?.data?.message || error.response?.data || error.message;
      setRunResult({ status: "error", message: errorMessage });
    }
    setIsSubmitting(false);
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    setActiveBottomTab("result");
    setSubmitResult(null);
    setRunResult(null);
    try {
      // FIX: Calls POST /submission/submit/:id (Uses correct mount point)
      const { data } = await axiosClient.post(
        `/submission/submit/${problemId}`,
        {
          code: code,
          language: selectedLanguage,
        }
      );
      // 'data' from submitCode is the submission document
      console.log(data);
      setSubmitResult(data);
    } catch (error) {
      // Robust error handling for server/API errors
      const errorMessage =
        error.response?.data?.message || error.response?.data || error.message;
      setSubmitResult({ status: "error", message: errorMessage });
    }
    setIsSubmitting(false);
  };

  if (loading && !problem) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-white"></span>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-400 flex items-center justify-center">
        <h1 className="text-2xl">Problem not found or failed to load.</h1>
      </div>
    );
  }

  // --- STYLING ---
  const tabBtn = "px-4 py-2 text-sm font-medium transition-colors";
  const activeTabBtn = "text-white border-b-2 border-indigo-500";
  const inactiveTabBtn = "text-gray-400 hover:text-gray-200";

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200">
      {/* --- Navbar --- */}
      <nav className="navbar bg-gray-800 shadow-lg px-4 flex-shrink-0">
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-xl text-white">
            LeetCode
          </NavLink>
        </div>
        <div className="flex-none gap-4">
          {user && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost text-white"
              >
                {user?.firstName}
              </div>
              <ul
                tabIndex={0}
                className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-gray-800 rounded-box w-52 z-50"
              >
                <li>
                  <NavLink to="/">All Problems</NavLink>
                </li>
                {/* You can add logout button here */}
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* --- Main Content (Splitter) --- */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 p-2 overflow-auto">
        {/* --- Left Panel --- */}
        <div className="bg-gray-800 rounded-lg shadow-lg flex flex-col overflow-auto">
          {/* Left Panel Tabs */}
          <div className="flex border-b border-gray-700 flex-shrink-0">
            {[
              "description",
              "editorial",
              "submissions",
              "chatAI",
            ].map((tab) => (
              <button
                key={tab}
                className={`${tabBtn} ${
                  activeLeftTab === tab ? activeTabBtn : inactiveTabBtn
                }`}
                onClick={() => setActiveLeftTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Left Panel Content */}
          <div className="p-5 overflow-y-auto">
            {activeLeftTab === "description" && (
              <div>
                <h1 className="text-2xl font-bold mb-3">{problem.title}</h1>
                <div
                  className={`badge mb-4 ${
                    problem.difficulty === "easy"
                      ? "badge-success"
                      : problem.difficulty === "medium"
                      ? "badge-warning"
                      : "badge-error"
                  }`}
                >
                  {problem.difficulty}
                </div>
                <div
                  className="prose prose-invert text-gray-300 max-w-none"
                  dangerouslySetInnerHTML={{ __html: problem.description }}
                />

                <div className="mt-8 space-y-4">
                  <h2 className="text-xl font-semibold">Test Cases</h2>
                  {problem?.visibleTestCases?.map((tc, index) => (
                    <div key={index}>
                      <p className="font-medium text-sm">Case {index + 1}:</p>
                      <pre className="bg-gray-700 p-2 rounded-md mt-1 text-xs font-mono whitespace-pre-wrap">
                        <strong>Input:</strong> {tc.input}
                        <br />
                        <strong>Output:</strong> {tc.output}
                        <br />
                        <strong>Explanation:</strong> {tc.explanation}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeLeftTab === "editorial" && (
              <div className="prose max-w-none">
                <h2 className="text-xl font-bold mb-4">Editorial </h2>
                <div className="whitespace-pre-wrap text-sm leading-relaxed"><Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration}/></div>
              </div>
            )}

            {activeLeftTab === "chatAI" && (
              <div className="prose max-w-none">
                <h2 className="text-xl font-bold mb-4">Chat with AI </h2>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  <ChatAI problem={problem}></ChatAI>
                </div>
              </div>
            )}
            {activeLeftTab === "submissions" && (
              <div>
                <h2 className="text-xl font-semibold">My Submissions</h2>
                <div className="text-gray-400 mt-4">
                  <SubmissionHistory problemId={problemId} />
                  
                </div>
                {/* In real app, you'd fetch and map over submissions */}
              </div>
            )}
          </div>
        </div>

        {/* --- Right Panel (Editor + Output) --- */}
        <div className="bg-gray-800 rounded-lg shadow-lg flex flex-col overflow-auto">
          {/* Language Selector */}
          <div className="p-2 flex-shrink-0">
            <select
              className="select select-sm bg-gray-700 border border-gray-600"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>

          {/* Editor */}
          <div className="flex-1 w-full h-full min-h-[300px]">
            <Editor
              height="100%"
              language={selectedLanguage}
              theme="vs-dark"
              value={code}
              onMount={handleEditorDidMount}
              onChange={(value) => setCode(value)}
            />
          </div>

          {/* --- Bottom Panel (Test Cases / Output) --- */}
          <div className="flex-shrink-0 border-t border-gray-700">
            {/* Bottom Panel Tabs */}
            <div className="flex border-b border-gray-700">
              <button
                className={`${tabBtn} ${
                  activeBottomTab === "testcases"
                    ? activeTabBtn
                    : inactiveTabBtn
                }`}
                onClick={() => setActiveBottomTab("testcases")}
              >
                Test Cases
              </button>
              <button
                className={`${tabBtn} ${
                  activeBottomTab === "result" ? activeTabBtn : inactiveTabBtn
                }`}
                onClick={() => setActiveBottomTab("result")}
              >
                Result
              </button>
            </div>

            {/* Bottom Panel Content */}
            <div className="p-4 overflow-y-auto max-h-48">
              {activeBottomTab === "testcases" && (
                <div className="space-y-3">
                  {problem?.visibleTestCases?.map((tc, index) => (
                    <div key={index}>
                      <p className="font-medium text-sm">Case {index + 1}:</p>
                      <pre className="bg-gray-700 p-2 rounded-md mt-1 text-xs font-mono whitespace-pre-wrap">
                        <strong>Input:</strong> {tc.input}
                        <br />
                        <strong>Output:</strong> {tc.output}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
              {activeBottomTab === "result" && (
                <div>
                  {isSubmitting && (
                    <span className="loading loading-spinner loading-sm"></span>
                  )}

                  {/* Display for Run Code (array of results) */}
                  {runResult && (
                    <div className="space-y-2">
                      {/* Check if error or success */}
                      {runResult.status === "error" && (
                        <pre className="text-sm font-mono text-red-400">
                          {runResult.message || "An error occurred."}
                        </pre>
                      )}
                      {runResult.status === "success" &&
                        Array.isArray(runResult.output?.output) && (
                          <>
                            <p className="font-medium text-sm text-gray-400 mb-2">
                              Passed:{" "}
                              {
                                runResult.output.output.filter(
                                  (r) => r.status_id === 3
                                ).length
                              }{" "}
                              / {runResult.output.output.length}
                            </p>

                            {runResult.output.output.map((result, index) => (
                              <div key={index}>
                                <p
                                  className={`font-medium text-sm ${
                                    result.status_id === 3
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  Case {index + 1}: {result.status.description}
                                </p>
                                {result.status_id !== 3 && (
                                  <pre className="text-xs font-mono bg-gray-700 p-2 rounded-md mt-1">
                                    {`Expected: ${
                                      result.expected_output
                                    }\nGot: ${result.stdout || "N/A"}\n`}
                                    {result.stderr && `Error: ${result.stderr}`}
                                    {result.compile_output &&
                                      `Compile Error: ${result.compile_output}`}
                                  </pre>
                                )}
                              </div>
                            ))}
                          </>
                        )}
                    </div>
                  )}

                  {/* Display for Submit Code (submission object) */}
                  {submitResult && (
                    <div
                      className={`p-3 rounded-md ${
                        submitResult.status === "accepted"
                          ? "bg-green-900/50"
                          : "bg-red-900/50"
                      }`}
                    >
                      <p
                        className={`font-bold text-lg ${
                          submitResult.status === "accepted"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        Status: {submitResult.status}
                      </p>
                      {submitResult.status !== "accepted" && (
                        <pre className="text-sm font-mono whitespace-pre-wrap mt-2">
                          {submitResult.errorMessage}
                        </pre>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Passed: {submitResult.testCasesPassed} /{" "}
                        {submitResult.testCasesTotal}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Run/Submit Buttons */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-2 border-t border-gray-700 flex-shrink-0"
          >
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onRun}
                disabled={isSubmitting}
              >
                {isSubmitting && !submitResult ? "Running..." : "Run Code"}
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting && submitResult ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
