/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";

const AdminUpdate = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState({
    title: "",
    description: "",
    difficulty: "",
    tags: "",
    visibleTestCases: [],
    starterCode: [],
    referenceSolution: [],
  });

  const [loading, setLoading] = useState(true);

  // ✅ Fetch problem details
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axiosClient.get(`/problem/problemById/${problemId}`);
        setProblem(res.data);
      } catch (err) {
        console.error("Error fetching problem:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  // ✅ Update general fields
  const handleChange = (e) => {
    setProblem({ ...problem, [e.target.name]: e.target.value });
  };

  // ✅ Handle dynamic array changes
  const handleArrayChange = (field, index, key, value) => {
    const updated = [...problem[field]];
    updated[index][key] = value;
    setProblem({ ...problem, [field]: updated });
  };

  // ✅ Add new dynamic entry (test case / starter code / ref solution)
  const handleAddField = (field, newObj) => {
    setProblem({ ...problem, [field]: [...problem[field], newObj] });
  };

  // ✅ Remove dynamic entry
  const handleRemoveField = (field, index) => {
    const updated = problem[field].filter((_, i) => i !== index);
    setProblem({ ...problem, [field]: updated });
  };

  // ✅ Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/problem/update/${problemId}`, problem);
      alert("✅ Problem updated successfully");
      navigate("/admin/update");
    } catch (err) {
      console.error("Error updating problem:", err);
      alert("❌ Update failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          ✏️ Update Problem
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Fields */}
          <input
            name="title"
            value={problem.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-3 rounded bg-gray-700 text-white"
          />

          <textarea
            name="description"
            value={problem.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-3 rounded bg-gray-700 text-white"
            rows="4"
          ></textarea>

          <select
            name="difficulty"
            value={problem.difficulty}
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 text-white"
          >
            <option value="">Select Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <input
            name="tags"
            value={problem.tags}
            onChange={handleChange}
            placeholder="Tags (e.g. Array, String, Graph)"
            className="w-full p-3 rounded bg-gray-700 text-white"
          />

          {/* Visible Test Cases */}
          <div>
            <h2 className="text-xl font-semibold mb-2 text-white">
              🧪 Visible Test Cases
            </h2>
            {problem.visibleTestCases.map((test, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded mb-4">
                <input
                  value={test.input}
                  onChange={(e) =>
                    handleArrayChange("visibleTestCases", index, "input", e.target.value)
                  }
                  placeholder="Input"
                  className="w-full p-2 mb-2 rounded bg-gray-600 text-white"
                />
                <input
                  value={test.output}
                  onChange={(e) =>
                    handleArrayChange("visibleTestCases", index, "output", e.target.value)
                  }
                  placeholder="Output"
                  className="w-full p-2 mb-2 rounded bg-gray-600 text-white"
                />
                <textarea
                  value={test.explanation}
                  onChange={(e) =>
                    handleArrayChange("visibleTestCases", index, "explanation", e.target.value)
                  }
                  placeholder="Explanation"
                  className="w-full p-2 rounded bg-gray-600 text-white"
                  rows="2"
                ></textarea>
                <button
                  type="button"
                  onClick={() => handleRemoveField("visibleTestCases", index)}
                  className="text-red-400 hover:text-red-500 mt-2"
                >
                  Remove Test Case
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                handleAddField("visibleTestCases", {
                  input: "",
                  output: "",
                  explanation: "",
                })
              }
              className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded text-white"
            >
              ➕ Add Test Case
            </button>
          </div>

          {/* Starter Code */}
          <div>
            <h2 className="text-xl font-semibold mb-2 text-white">💻 Starter Code</h2>
            {problem.starterCode.map((code, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded mb-4">
                <input
                  value={code.language}
                  onChange={(e) =>
                    handleArrayChange("starterCode", index, "language", e.target.value)
                  }
                  placeholder="Language (e.g. Java, C++, Python)"
                  className="w-full p-2 mb-2 rounded bg-gray-600 text-white"
                />
                <textarea
                  value={code.code}
                  onChange={(e) =>
                    handleArrayChange("starterCode", index, "code", e.target.value)
                  }
                  placeholder="Starter Code"
                  className="w-full p-2 rounded bg-gray-600 text-white"
                  rows="4"
                ></textarea>
                <button
                  type="button"
                  onClick={() => handleRemoveField("starterCode", index)}
                  className="text-red-400 hover:text-red-500 mt-2"
                >
                  Remove Code
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                handleAddField("starterCode", { language: "", code: "" })
              }
              className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded text-white"
            >
              ➕ Add Starter Code
            </button>
          </div>

          {/* Reference Solutions */}
          <div>
            <h2 className="text-xl font-semibold mb-2 text-white">📘 Reference Solution</h2>
            {problem.referenceSolution.map((ref, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded mb-4">
                <input
                  value={ref.language}
                  onChange={(e) =>
                    handleArrayChange("referenceSolution", index, "language", e.target.value)
                  }
                  placeholder="Language (e.g. Java, C++)"
                  className="w-full p-2 mb-2 rounded bg-gray-600 text-white"
                />
                <textarea
                  value={ref.code}
                  onChange={(e) =>
                    handleArrayChange("referenceSolution", index, "code", e.target.value)
                  }
                  placeholder="Solution Code"
                  className="w-full p-2 rounded bg-gray-600 text-white"
                  rows="4"
                ></textarea>
                <button
                  type="button"
                  onClick={() => handleRemoveField("referenceSolution", index)}
                  className="text-red-400 hover:text-red-500 mt-2"
                >
                  Remove Solution
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                handleAddField("referenceSolution", { language: "", code: "" })
              }
              className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded text-white"
            >
              ➕ Add Reference Solution
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md font-semibold text-white transition"
          >
            ✅ Update Problem
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdate;
