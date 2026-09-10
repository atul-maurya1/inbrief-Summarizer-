import {useContext, useState} from "react"
import {authContext} from '../context/authContext'


function ProfilePic (){

    const{ user } = useContext(authContext)

 

    let img = ""
    let name = (user?.data?.firstName[0] + user?.data?.lastName[0])
    return(
         <div className="flex size-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50" >
                   {img ? <img src="placeholder"  alt="profile pic" /> : <p className="text-sm font-bold text-blue-700" >{name}</p> }   
                 </div>
    )
}

export default ProfilePic