
function ProfilePic (){
    let img = ""
    return(
         <div className="rounded-full bg-blue-200 size-10 flex items-center justify-center " >
                   {img ? <img src="placeholder"  alt="profile pic" /> : <p className="text-blue-700" >JD</p> }   
                 </div>
    )
}

export default ProfilePic