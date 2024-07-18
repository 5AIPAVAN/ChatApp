import React, { useEffect, useState } from 'react'
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
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";

import { useDispatch} from 'react-redux';
import Divider from './Divider.js';
import SearchUser from './SearchUser.js';


export default function Sidebar() {

    const user = useSelector(state => state.user);
   

      // obtain T/F wheather socket is connected or not from redux
  const socketConnection = useSelector(state=> state?.user?.socketConnection);

  useEffect(()=>{

    if(socketConnection){
        socketConnection.emit('sidebar',user._id);

        socketConnection.on('conversation',(data)=>{
            console.log('conversation',data);

            const conversationUserData = data.map((conversationUser,index)=>{
                if(conversationUser?.sender?._id === conversationUser?.receiver?._id){
                    return{
                        ...conversationUser,
                        userDetails : conversationUser?.sender
                    }
                }
                else if(conversationUser?.receiver?._id !== user?._id){
                    return{
                        ...conversationUser,
                        userDetails : conversationUser.receiver
                    }
                }else{
                    return{
                        ...conversationUser,
                        userDetails : conversationUser.sender
                    }
                }
            })

            setAllUser(conversationUserData)

        })
    }

  },[socketConnection,user])


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

{
                        allUser.map((conv,index)=>{
                            return(
                                <NavLink to={"/"+conv?.userDetails?._id} key={conv?._id} className='flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer'>
                                    <div>
                                        <Avatar
                                            imageUrl={conv?.userDetails?.profile_pic}
                                            name={conv?.userDetails?.name}
                                            width={40}
                                            height={40}
                                        />    
                                    </div>
                                    <div>
                                        <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{conv?.userDetails?.name}</h3>
                                        <div className='text-slate-500 text-xs flex items-center gap-1'>
                                            <div className='flex items-center gap-1'>
                                                {
                                                    conv?.lastMsg?.imageUrl && (
                                                        <div className='flex items-center gap-1'>
                                                            <span><FaImage/></span>
                                                            {!conv?.lastMsg?.text && <span>Image</span>  } 
                                                        </div>
                                                    )
                                                }
                                                {
                                                    conv?.lastMsg?.videoUrl && (
                                                        <div className='flex items-center gap-1'>
                                                            <span><FaVideo/></span>
                                                            {!conv?.lastMsg?.text && <span>Video</span>}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <p className='text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                                        </div>
                                    </div>
                                    {/* {
                                        Boolean(conv?.unseenMsg) && (
                                            <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full'>{conv?.unseenMsg}</p>
                                        )
                                    } */}

                                </NavLink>
                            )
                        })
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
