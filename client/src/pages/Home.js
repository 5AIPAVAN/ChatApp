import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'

import { useDispatch } from 'react-redux';
import { logout,setOnlineUser,setSocketConnection,setUser } from '../redux/userSlice';
import { useNavigate,useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import logo from '../assets/logo.png'
import io from 'socket.io-client'

export default function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation()
  const user = useSelector(state => state.user);

  console.log("user data from redux in home.js",user)

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



// Socket connection

useEffect(()=>{

  // io(....,{}) initializes a new Socket.IO client instance.
  //By including an authentication token in the connection request
  // the server can verify the identity of the client. This is important for security reasons,

  const socketConnection = io(process.env.REACT_APP_BACKEND_URL,{
    auth : {
      token : localStorage.getItem('token')
    }
  });

  // obtaining data of onlineUserd sent from server 
  socketConnection.on('onlineUser',(data)=>{
    console.log(data);

    // store online users data obtained from server globally in redux variables
    dispatch(setOnlineUser(data));
  })

  dispatch(setSocketConnection(socketConnection));



  return()=>{
    socketConnection.disconnect()
  }

},[]);













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


        <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex" }`}>
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
