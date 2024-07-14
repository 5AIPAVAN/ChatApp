import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'

import { useDispatch } from 'react-redux';
import { logout,setUser } from '../redux/userSlice';
import { useNavigate,useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import logo from '../assets/logo.png'

export default function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation()
  const user = useSelector(state => state.user);
  console.log("user data from redux",user)

  const fetchUserDetailsFromCookie= async ()=>{
    try{
   const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
   const response = await axios({
    method :'get',
    url : URL,
    withCredentials : true
  })

  console.log("response in home page",response);
  dispatch(setUser(response?.data?.data));

  if(response.data.data.logout){
    dispatch(logout());
    navigate('/email');
  }

    }catch(error){
      console.log("error in fetch user-details in home page"+error);
    }

  }

  useEffect(()=>{
   fetchUserDetailsFromCookie();
  },[])

const basePath = location.pathname === '/'

  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
     
     <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
           <Sidebar/>
        </section>

        {/**message component**/}
        <section className={`${basePath && "hidden"}`} >
            <Outlet/>
        </section>


        <div className='lg:flex flex-col justify-center items-center gap-4  hidden'>
          <div>
            <img 
            src={logo}
            alt="Logo"
            width={250}/>
            <p className='text-lg text-stone-500'>Select a Person to start conversation</p>
          </div>
        </div>


    </div>
  )
}
