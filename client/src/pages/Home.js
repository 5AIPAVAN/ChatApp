import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'

import { useDispatch } from 'react-redux';
import { logout,setUser } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
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

  if(response.data.logout){
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



  return (
    <div>
      Home Page
      <section>
        <Outlet/>
      </section>
    </div>
  )
}
