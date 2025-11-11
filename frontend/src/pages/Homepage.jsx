import { useEffect, useState } from "react";
// 1. FIXED: Import from 'react-router-dom'
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 5;

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        // Your route is /getAllProblem
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(data);
      } catch (error) {
        console.log("Error fetching problems:", error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        // Your route is /problemSolvedByUser
        const { data } = await axiosClient.get("/problem/problemSolvedByUser");
        setSolvedProblems(data);
      } catch (error) {
        console.log("Error fetching solved problems:", error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  // 2. FIXED: Updated filtering logic for tags (string) and status
  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" || problem.difficulty === filters.difficulty;

    // Your problem.tags is a string, not an array, based on model
    const tagMatch =
      filters.tag === "all" ||
      problem.tags?.toLowerCase() === filters.tag.toLowerCase();

    const isSolved = solvedProblems.some((sp) => sp._id === problem._id);
    const statusMatch =
      filters.status === "all" ||
      (filters.status === "solved" && isSolved) ||
      (filters.status === "unsolved" && !isSolved);

    return difficultyMatch && tagMatch && statusMatch;
  });

  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = filteredProblems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  );
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <nav className="navbar bg-gray-800 shadow-lg px-4">
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-xl text-white">
            LeetCode
          </NavLink>
        </div>
        <div className="flex-none gap-4">
          {/* 3. FIXED: Show Login/Signup if no user */}
          {user ? (
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
                  <button onClick={handleLogout}>Logout</button>
                </li>
                {user.role === "admin" && (
                  <li>
                    <NavLink to="/admin">Admin</NavLink>
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <NavLink to="/login" className="btn btn-ghost text-white">
                Login
              </NavLink>
              <NavLink to="/signup" className="btn btn-primary">
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* main content */}
      <div className="container mx-auto p-4">
        {/* filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            className="select bg-gray-700 border border-gray-600"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>

          <select
            className="select bg-gray-700 border border-gray-600"
            value={filters.difficulty}
            onChange={(e) =>
              setFilters({ ...filters, difficulty: e.target.value })
            }
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="select bg-gray-700 border border-gray-600"
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          >
            <option value="all">All Tags</option>
            {/* These must match your backend problem model enums */}
            <option value="array">Array</option>
            <option value="string">String</option>
            <option value="linked-list">Linked-List</option>
            <option value="graph">Graph</option>
          </select>
        </div>

        {/* problem list */}
        <div className="flex flex-col gap-4">
          {currentProblems.map((problem) => (
            <div key={problem._id} className="card bg-gray-800 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <h2 className="card-title">
                    {/* 4. FIXED: Removed onClick so NavLink works */}
                    <NavLink
                      to={`/problem/${problem._id}`}
                      className="link link-hover text-white hover:text-indigo-400"
                    >
                      {problem.title}
                    </NavLink>
                  </h2>
                  {solvedProblems.some((sp) => sp._id === problem._id) && (
                    <div className="badge badge-success gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Solved
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <div
                    className={`badge ${getDifficultyBadgeColor(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty}
                  </div>
                  {/* 5. FIXED: problem.tags is a string */}
                  <div className="badge badge-info">{problem.tags}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-sm btn-outline"
            >
              Previous
            </button>

            {/* Show page numbers */}
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`btn btn-sm ${
                  currentPage === index + 1
                    ? "btn-primary"
                    : "btn-outline text-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-sm btn-outline"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  if (!difficulty) return "badge-neutral";
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "badge-success";
    case "medium":
      return "badge-warning";
    case "hard":
      return "badge-error";
    default:
      return "badge-neutral";
  }
};

export default Homepage;
