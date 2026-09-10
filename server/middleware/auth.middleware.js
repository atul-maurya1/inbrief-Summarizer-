import ApiError from "../utils/apiError.js"
import jwt from "jsonwebtoken"
import User from '../models/user.model.js'

export const verifyJWT = async(req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if(!token){
        throw new ApiError(401 ,"Unauthorized user")
    }

    const decoded =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decoded.id).select('-refreshToken -password')
    if(!user){
           throw new ApiError(400 ,"Invalid token")
        
    }
  
   req.user = user
   next()

}  