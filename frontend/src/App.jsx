import './App.css'
// 1. FIXED: Import from 'react-router-dom'
import {Routes,Route,Navigate} from 'react-router' 
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminPanel from './pages/AdminPanel'
import Homepage from './pages/Homepage'
// 2. IMPORT THE PROBLEM PAGE
import ProblemPage from './pages/ProblemPage' 
import {checkAuth} from "./authSlice"
import { useDispatch,useSelector } from 'react-redux'
import { useEffect } from 'react'

function App() {
  const dispatch=useDispatch();
  const {isAuthenticated,user,loading}=useSelector((state)=>state.auth);
  
  useEffect(()=>{
    dispatch(checkAuth());
  },[dispatch]);

  // Use dark background for loading
  if(loading){
    return <div className='min-h-screen flex items-center justify-center bg-gray-900'>
      <span className='loading loading-spinner loading-lg text-white'></span>
    </div>
  }

  return(
    <>
    <Routes>
      <Route path="/" element={isAuthenticated?<Homepage />:<Navigate to="/signup"/>}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/"/>:<Login />}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/"/>:<Signup />}></Route>
      {/* 3. FIXED: Robust check for admin role */}
      <Route path="/admin" element={isAuthenticated && user?.role?.toLowerCase()==="admin"?<AdminPanel/>:<Navigate to="/"/>}></Route>
      
      {/* 4. ADDED: Route for the problem page */}
      <Route 
        path="/problem/:problemId" 
        element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login" />}
      />
      
      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </>
  )
}

export default App
