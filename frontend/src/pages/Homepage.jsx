import { useEffect,useState } from "react";
import { NavLink } from "react-router";
import { useDispatch,useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";

function Homepage(){
    const dispatch=useDispatch();
    const {user}=useSelector((state)=>state.auth);
    const [problems,setProblems]=useState([]);
    const [solvedProblems,setSolvedProblems]=useState([]);
    const [filters,setFilters]=useState({
        difficulty:"all",
        tag:"all",
        status:"all"
    });

    useEffect(()=>{
        const fetchProblems=async()=>{
            try{
                const {data}=await axiosClient.get('/problem/getAllProblems');
                setProblems(data);
            }catch(error){
                console.log("Error fetching problems:", error);
            }
        };

        const fetchSolvedProblems=async()=>{
            try{
                const {data}=await axiosClient.get("/problem/solvedProblembyUser");
                setSolvedProblems(data);
            }catch(error){
                console.log("Error fetching solved problems:", error);
            }
        };

        fetchProblems();
        if(user) fetchSolvedProblems();
    },[user]);

    const handleLogout=()=>{
        dispatch(logoutUser());
        setSolvedProblems([]);
    };

    const filteredProblems=problems.filter(problem=>{
        const difficultyMatch=filters.difficulty==="all" || problem.difficulty===filters.difficulty;
        const tagMatch=filters.tag==="all" || problems.tags===filters.tag;
        const statusMatch=filters.status==="all" || solvedProblems.some(sp=>sp._id===problem._id);
        return difficultyMatch && tagMatch && statusMatch;
    });
    return(
        <div className="min-h-screen bg-gray-900 text-gray-200">
            <nav className="navbar bg-gray-800 shadow-lg px-4">
                <div className="flex-1">
                    <NavLink to="/" className="btn btn-ghost text-xl text-white">LeetCode</NavLink>
                </div>
                <div className="flex-none gap-4">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} className="btn btn-ghost">{user?.firstName}</div>
                        <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-gray-800 rounded-box w-52 z-50">
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </ul>
                    </div>
                </div>
            </nav>

        {/* main content */}
        <div className="container mx-auto p-4">
            {/* filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                {/* new status filter */}
                <select 
                  className="select bg-gray-700 border border-gray-600"
                  value={filters.status}
                  onChange={(e)=>setFilters({...filters,status:e.target.value})}
                  >
                    <option value="all">All Problems</option>
                    <option value="solved">Solved Problems</option>
                  </select>

                  <select
                  className="select bg-gray-700 border border-gray-600"
                  value={filters.difficulty}
                  onChange={(e)=>setFilters({...filters,difficulty:e.target.value})}
                  >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>

                  <select
                  className="select bg-gray-700 border border-gray-600"
                  value={filters.tag}
                  onChange={(e)=>setFilters({...filters,tag: e.target.value})}
                  >
                    <option value="all">All Tags</option>
                    <option value="array">Array</option>
                    <option value="linkedList">Linked List</option>
                    <option value="graph">Graph</option>
                    <option value="dp">DP</option>
                  </select>
            </div>

            {/* problem list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProblems.map(problem=>(
                    <div key={problem._id} className="card bg-gray-800 shadow-xl">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <h2 className="card-title">
                                    <NavLink 
                                        to={`/problem/${problem._id}`} 
                                        className="link link-hover text-white hover:text-indigo-400"
                                        onClick={(e) => e.preventDefault()} 
                                    >
                                        {problem.title}
                                    </NavLink>
                                </h2>
                                {solvedProblems.some(sp=>sp._id===problem._id) && (
                                    <div className="badge badge-success gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Solved
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 mt-4">
                                <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}>
                                    {problem.difficulty}
                                </div>
                                <div className="badge badge-info">
                                    {problem.tags}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>      
    );
};

const getDifficultyBadgeColor=(difficulty)=>{
    switch (difficulty.toLowerCase()){
        case "easy":return "badge-success";
        case "medium":return "badge-warning";
        case "hard":return "badge-error";
        default :return "badge-neutral";
    }
};

export default Homepage;