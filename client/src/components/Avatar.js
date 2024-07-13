import React from 'react'
import { PiUserCircle } from "react-icons/pi";

export default function Avatar({userId,name,ProfilePicUrl}) {

    let avatarName = "";

    if(name){
        const splittedname = name?.split(" ");
        if(splittedname.length>1){
            avatarName = splittedname[0][0]+splittedname[1][0];
        }else{
            avatarName = splittedname[0][0];
        }
    }
  return (
    <div className={`text-slate-800  rounded-full font-bold relative`} style={{width : '90px', height : '90px' }}>
    {
        ProfilePicUrl ? (
            <img
                src={ ProfilePicUrl}
                width= '80px'
                height= '90px'
                alt={name}
                className='overflow-hidden rounded-full'
            />
        ) : (
            name ? (
                <div  style={{width : '90px', height : '90px' }} className={`overflow-hidden rounded-full flex justify-center items-center text-lg bg-red-200`}>
                    {avatarName}
                </div>
            ) :(
              <PiUserCircle
                size={{width:'90px'}}
              />
            )
        )
    }
    </div>
  )
}
