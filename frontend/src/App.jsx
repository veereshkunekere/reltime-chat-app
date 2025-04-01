import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Setting from './pages/Setting'
import Profile from './pages/Profile'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import {Loader} from 'lucide-react'
import {Toaster} from 'react-hot-toast'
function App() {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers} = useAuthStore();
  console.log(onlineUsers)
  const {theme}=useThemeStore()
  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  // console.log(authUser);

  if(isCheckingAuth ){
    return (
      <div className='flex items-center justify-center h-screen'> 
          <Loader className='size-10 animate-spin'/>
      </div>
    )
  }

return(
<div data-theme={theme }>
  <Navbar></Navbar>
  <Routes>
    <Route path='/' element={authUser?<HomePage></HomePage>:<Navigate to='/login'></Navigate>}></Route>
    <Route path='/signup' element={!authUser?<Signup></Signup>:<Navigate to='/'/>}></Route>
    <Route path='/login' element={<Login></Login>}></Route>
    <Route path='/settings' element={<Setting></Setting>}></Route>
    <Route path='/profile' element={authUser?<Profile></Profile>:<Navigate to='/login'></Navigate>}></Route>
  </Routes>
  <Toaster/>
</div>
)
}

export default App
