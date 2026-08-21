import ApiError from '../utils/apiError.js'
import ApiResponse from '../utils/apiRespone.js'
import User from "../models/user.model.js"

const cookiesOptions = {
    httpOnly: true,
    secure: true, // requires https
    maxAge: 24 * 60 * 60 * 1000, 
    sameSite: 'lax' // Recommended to prevent CSRF attacks

}

const generateAccessTokenAndRrefreshToken = async(userId) => {
    try{
        const user = await User.findById(userId)
        console.log(user)
        if(!user){
            throw new ApiError(404, "User not found")
        }

        const refreshToken = await user.generateRefreshToken()
        const accessToken = await user.generateAccessToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false });
        
        return {refreshToken, accessToken}

    }catch(err){
        console.error("error while generating tokens ", err)
        throw new ApiError(500, "Internal server error")
    }

}

export const userRegister = async (req, res, next) => {

    try{
        const {firstName, lastName, email, password, confirmPassword} = req.body
        if(!firstName || !email || !password || !confirmPassword){
            throw new ApiError(400, "All fields are requireds")
        }
        if(password !== confirmPassword){ 
            throw new ApiError(400, "password and confirmPassword is not same")
        }
        const isExists = await User.findOne({email})
        if(isExists){
            throw new ApiError(400, "User with this email is already exists")
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password
        })

        const {accessToken, refreshToken} = await generateAccessTokenAndRrefreshToken(user._id)

        console.log(accessToken)
        
        res.cookie( "accessToken", accessToken, cookiesOptions)
        res.cookie( "refreshToken", refreshToken, cookiesOptions)

        res.status(201).json(
            new ApiResponse(201, user, "user register successfully")
        )


    }catch(err){
         console.error("error while register ", err)

         if(err instanceof ApiError){
          next(err)
         }
       throw new ApiError(500, "Internal server error")

    }
    

}