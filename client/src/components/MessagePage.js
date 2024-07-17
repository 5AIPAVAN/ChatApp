import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams,Link } from 'react-router-dom'
import { Socket } from 'socket.io-client';
import Avatar from './Avatar';
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaImage, FaVideo } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import uploadFile from '../helpers/uploadFile';
import { IoClose } from 'react-icons/io5';
import wallapaper from '../assets/wallapaper.jpeg'
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

  const [message,setMessage] = useState({
    text : "",
    imageUrl : "",
    videoUrl : ""
  })

  const [openImageVideoUpload,setOpenImageVideoUpload] = useState(false);
  const handleUploadImageVideoOpen = ()=>{
    setOpenImageVideoUpload(preve => !preve)
  }

  const handleUploadImage= async(e)=>{
    const file = e.target.files[0]
    const uploadPhoto = await uploadFile(file)
    setMessage((preve)=>{
      return{
        ...preve,
        imageUrl : uploadPhoto?.url
      }
    })
  }

  const handleUploadVideo= async(e)=>{
    const file = e.target.files[0]
    const uploadVideo = await uploadFile(file)
    setMessage((preve)=>{
      return{
        ...preve,
        videoUrl : uploadVideo?.url
      }
    })
  }

  const handleClearUploadImage=()=>{
    setMessage((preve)=>{
      return{
        ...preve,
        imageUrl : ""
      }
    })
  }

  const handleClearUploadVideo = ()=>{
    setMessage(preve => {
      return{
        ...preve,
        videoUrl : ""
      }
    })
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
    <div style={{'backgroundImage':`url(${wallapaper})`}}  className='bg-no-repeat bg-cover bg-opacity-50'>

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
             {/**upload Image display */}
             {
                    message.imageUrl && (
                      <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                        <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadImage}>
                            <IoClose size={30}/>
                        </div>
                        <div className='bg-white p-3'>
                            <img
                              src={message.imageUrl}
                              alt='uploadImage'
                              className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                            />
                        </div>
                      </div>
                    )
                  }

                  {/**upload video display */}
                  {
                    message.videoUrl && (
                      <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                        <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadVideo}>
                            <IoClose size={30}/>
                        </div>
                        <div className='bg-white p-3'>
                            <video 
                              src={message.videoUrl} 
                              className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                              controls
                              muted
                              autoPlay
                            />
                        </div>
                      </div>
                    )
                  }
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

             <input type='file'
             id='uploadImage'
             onChange={handleUploadImage}
             className='hidden'/>

             <input type='file'
             id='uploadVideo'
             onChange={handleUploadVideo}
             className='hidden'/>

            </form>
          </div>)
}
        
          </div>

          </section>




     
    </div>
  )
}
