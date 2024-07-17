import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import Avatar from "./Avatar.js";
import EditUserDetails from './EditUserDetails.js';
import { useSelector } from 'react-redux';
import { logout } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { FiArrowUpLeft } from "react-icons/fi";

import { useDispatch} from 'react-redux';
import Divider from './Divider.js';
import SearchUser from './SearchUser.js';


export default function Sidebar() {
    const user = useSelector(state => state.user);


    const [editUser,setEditUser] = useState(false);
    const [openSearchUser,setOpenSearchUser] = useState(false);

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [allUser,setAllUser] = useState([]);

    const handleLogout = ()=>{
        dispatch(logout())
        navigate("/email")
        localStorage.clear()
    }
  return (
    <div className='w-full h-full grid grid-cols-[48px,1fr]'>

    <div className='bg-slate-100 w-12 h-full rounded-tr-lg py-4 flex flex-col justify-between '>
        <div>
            <NavLink title='chat' className={({isActive})=>`hover:bg-slate-500 w-12 h-12 flex justify-center items-center cursor-pointer text-slate-600 ${isActive &&  "bg-slate-200"}`}>
            <IoChatbubbleEllipses
                            size={25}
                        />
            </NavLink>

            <div title='add friend' onClick={()=>setOpenSearchUser(true)} className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded' >
                        <FaUserPlus size={20}/>
                    </div>

        </div>

        <div>

            <button title='edit profile' className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded' onClick={()=>{setEditUser(true)}}>
                <Avatar name={user?.name}
                userId ={user?._id}
                ProfilePicUrl={user?.profile_pic}
                width = {40}
                height ={40}/>
            </button>

        <button title='logout' className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded'  onClick={handleLogout} >
                        <span className='-ml-2'>
                            <BiLogOut size={20}/>
                        </span>
                    </button>

        </div>
    </div>

    <div className='bg-white'>
        <div>
        <h5 className='text-xl font-bold p-4 text-slate-800 text-center h-16'>Messages</h5>
        </div>
     
        <Divider/>

        <div className=' h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>

        {
                        allUser.length === 0 && (
                            <div className='mt-12'>
                                <div className='flex justify-center items-center my-4 text-slate-500'>
                                    <FiArrowUpLeft
                                        size={50}
                                    />
                                </div>
                                <p className='text-lg text-center text-slate-400'>Explore users to start a conversation with.</p>    
                            </div>
                        )
                    }
        </div>
    </div>
  

    {
        editUser && (
            <EditUserDetails onClose={()=>{setEditUser(false)} } user={user}/>
        )
    }


  {
    openSearchUser&&(
        <SearchUser onClose={()=>{setOpenSearchUser(false)}}/>
    )
  }


    </div>
  )
}
