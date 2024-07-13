import React, { useState,useEffect } from 'react'
// import { IoClose } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import uploadFile from '../helpers/uploadFile';
import axios from 'axios'
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';

const CheckPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("id from location obtianed by navigate from email page"+location?.state._id);
  const [data,setData] = useState({
    password : "",
    userId : ""
  })

  useEffect(()=>{
    if(!location?.state?.name){
      navigate('/email')
    }
  },[])


  const handleOnChange = (e)=>{
    const { name, value} = e.target

    setData((preve)=>{
      return{
          ...preve,
          [name] : value
      }
    })
  }


 
  const handleSubmit = async(e)=>{
    e.preventDefault()
    e.stopPropagation()

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`

    try {
        const response = await axios({
          method :'post',
          url : URL,
          data : {
            userId : location?.state?._id,
            password : data.password
          },
          withCredentials : true
        })

        toast.success(response.data.message)

        if(response.data.success){
         

            setData({
              password : "",
            })
            navigate('/')
        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
  }


 

  return (
    <div className='mt-5'>
        <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>
             <div className='w-fit mx-auto mb-2 flex justify-center items-center flex-col'>
          
                <Avatar
                  name={location?.state?.name}
                  ProfilePicUrl={location?.state?.profile_pic}
                />
                <h2 className='font-semibold text-lg mt-1'>{location?.state?.name}</h2>
            </div>

          <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
                <label htmlFor='password'>Password :</label>
                <input
                  type='password'
                  id='password'
                  name='password'
                  placeholder='enter your password' 
                  className='bg-slate-100 px-2 py-1 focus:outline-primary'
                  value={data.password}
                  onChange={handleOnChange}
                  required
                />
              </div>

              <button
               className='bg-primary text-lg  px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'
              >
                Verify Password
              </button>

          </form>

          <p className='my-3 text-center'>Already have account ? <Link to={"/email"} className='hover:text-primary font-semibold'>Login</Link></p>
        </div>
    </div>
  )
}

export default CheckPasswordPage
