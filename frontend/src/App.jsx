import './App.css'
import {Routes,Route,Navigate} from 'react-router'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminPanel from './pages/AdminPanel'
import Homepage from './pages/Homepage'
import {checkAuth} from "./authSlice"
import { useDispatch,useSelector } from 'react-redux'
import { useEffect } from 'react'

function App() {
  //code likhna isAuthenticated ka
  const dispatch=useDispatch();
  const {isAuthenticated,user,loading}=useSelector((state)=>state.auth);

  //console.log("User object in App.jsx:", user);
  

  useEffect(()=>{
    dispatch(checkAuth());
  },[dispatch]);

  if(loading){
    return <div className='min-h-screen flex items-center justify-center'>
      <span className='loading loading-spinner loading-lg'></span>
    </div>
  }

  return(
    <>
    <Routes>
      <Route path="/" element={isAuthenticated?<Homepage></Homepage>:<Navigate to="/signup"/>}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/"/>:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/"/>:<Signup></Signup>}></Route>
      <Route path="/admin" element={isAuthenticated && user?.role==="admin"?<AdminPanel/>:<Navigate to="/"/>}></Route>
    </Routes>
    </>
  )
}

export default App
