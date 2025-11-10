import './App.css'

import {Routes,Route,Navigate} from 'react-router' 
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminPanel from './pages/AdminPanel'
import Admin from './pages/Admin'
import Homepage from './pages/Homepage'
import AdminDelete from './pages/AdminDelete'
import AdminVideo from './pages/AdminVideo'
import AdminUpload from './pages/AdminUpload'
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
      
      <Route path="/admin" element={isAuthenticated && user?.role?.toLowerCase()==="admin"?<Admin/>:<Navigate to="/"/>}></Route>
      <Route path="/admin/create" element={isAuthenticated && user?.role?.toLowerCase()==="admin"?<AdminPanel/>:<Navigate to="/"/>}></Route>
      <Route path="/admin/delete" element={isAuthenticated && user?.role?.toLowerCase()==="admin"?<AdminDelete/>:<Navigate to="/"/>}></Route>
      <Route path="/admin/video" element={isAuthenticated && user?.role?.toLowerCase()==="admin"?<AdminVideo/>:<Navigate to="/"/>}></Route>
      <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role?.toLowerCase()==="admin"?<AdminUpload/>:<Navigate to="/"/>}></Route>

      {/* <Route path="/admin" element={isAuthenticated && user?.role?.toLowerCase()==="admin"?<AdminPanel/>:<Navigate to="/"/>}></Route> */}

      <Route 
        path="/problem/:problemId" 
        element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login" />}
      />
       
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </>
  )
}

export default App
