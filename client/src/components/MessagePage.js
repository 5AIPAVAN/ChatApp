import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams,Link } from 'react-router-dom'
import { Socket } from 'socket.io-client';
import Avatar from './Avatar';
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaImage, FaVideo } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";

export default function MessagePage() {

  const params = useParams();

  // you details(logged in user details)
  const user = useSelector(state=> state?.user);

  // obtain T/F wheather socket is connected or not from redux
  const socketConnection = useSelector(state=> state?.user?.socketConnection);

  console.log("Params :",params.userId); // params is an object containing userId 

  const [dataUser,setDataUser] = useState({
    name : "",
    email : "",
    profile_pic : "",
    online : false,
    _id : ""
  });

  const [openImageVideoUpload,setOpenImageVideoUpload] = useState(false);
  const handleUploadImageVideoOpen = ()=>{
    setOpenImageVideoUpload(preve => !preve)
  }

  useEffect(()=>{
    if(socketConnection){
           socketConnection.emit('message-page',params.userId);

           socketConnection.on('message-user',(data_of_that_person)=>{
              // console.log("details of that person ",data)
              setDataUser(data_of_that_person);
           })
    }
  },[socketConnection,params.userId,user])

  return (
    <div>

{/* Top header section */}

<header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
              <div className='flex items-center gap-4'>
                  <Link to={"/"} className='lg:hidden'>
                      <FaAngleLeft size={25}/>
                  </Link>
                  <div>
                      <Avatar
                        width={50}
                        height={50}
                        ProfilePicUrl={dataUser?.profile_pic}
                        name={dataUser?.name}
                        userId={dataUser?._id}
                      />
                  </div>
                  <div>
                     <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
                     <p className='-my-2 text-sm'>
                      {
                        dataUser.online ? <span className='text-primary'>online</span> : <span className='text-slate-400'>offline</span>
                      }
                     </p>
                  </div>
              </div>

              <div >
                    <button className='cursor-pointer hover:text-primary'>
                      <HiDotsVertical/>
                    </button>
              </div>
          </header>

          {/* Message section */}

          <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>
            Messages will be shown here
          </section>



          {/* bottom input section */}

          <section className='h-16 bg-white flex items-center px-4'>
          
          <div className='realtive '>
            <button onClick={handleUploadImageVideoOpen} className='flex justify-center items-center rounded-full w-11 h-11 hover:bg-primary hover:text-white'> 
            <FaPlus size={20}/>
            </button>

 {
            openImageVideoUpload &&  (<div className='bg-white shadow rounded absolute bottom-20 w-36 p-2'>
            <form>
             <label htmlFor='uploadImage' className='flex items-center p-2 px-2 gap-3 hover:bg-slate-200 cursor-pointer'>
              <div className='text-primary'>
                <FaImage size={18}/>
              </div>
              <p> Image </p>
             </label>

             <label htmlFor='uploadVideo' className='flex items-center p-2 px-2 gap-3 hover:bg-slate-200 cursor-pointer'>
              <div className='text-purple-500'>
                <FaVideo size={18}/>
              </div>
              <p> Video </p>
             </label>

            </form>
          </div>)
}
        
          </div>

          </section>




     
    </div>
  )
}
