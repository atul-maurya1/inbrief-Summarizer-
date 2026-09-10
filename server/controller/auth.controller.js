import ApiError from '../utils/apiError.js'
import ApiResponse from '../utils/apiRespone.js'
import User from "../models/user.model.js"
import bcrypt from 'bcrypt'

const cookiesOptions = {
    httpOnly: true,
    secure: true, // requires https
    maxAge: 24 * 60 * 60 * 1000, 
    sameSite: 'lax' // Recommended to prevent CSRF attacks

}

const generateAccessTokenAndRrefreshToken = async(userId) => {
    try{
        const user = await User.findById(userId)
        //console.log(user)
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
            return res.status(400).json(
                new ApiError(400, "All fields are requireds")
        )
           
        }

        if(password !== confirmPassword){ 
             return res.status(400).json(
               new ApiError(400, "password and confirmPassword is not same")
        )
            
        }
        const isExists = await User.findOne({email})
        if(isExists){
            return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "User with this email already exists"
    });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password
        })

       

        const {accessToken, refreshToken} = await generateAccessTokenAndRrefreshToken(user._id)

         const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
        
        res.cookie( "accessToken", accessToken, cookiesOptions)
        res.cookie( "refreshToken", refreshToken, cookiesOptions)

        res.status(201).json(
            new ApiResponse(201, loggedInUser, "user register successfully")
        )


    }catch(error){
         // console.error("Error:", err);

           console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);
    console.log("MESSAGE:", error.response?.data?.message);

    return res.status(500).json(
        new ApiError(500, "Internal server error")
    );

    }
    

}


export const userLogin = async(req, res, next) => {
    try{
        const {email , password} = req.body
        if(!email || !password){
            throw new ApiError(400, "all fields are required")
        }

        const user = await User.findOne({email: email})
        if(!user){
            throw new ApiError(400, "email is not register")
        }

        const isPasswordCorrect = await user.comparePassword(password)
        if(!isPasswordCorrect){
            throw new ApiError(400, "incorrect Password")
        }

        const {accessToken, refreshToken} = await generateAccessTokenAndRrefreshToken(user._id)

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
        
        res.cookie( "accessToken", accessToken, cookiesOptions)
        res.cookie( "refreshToken", refreshToken, cookiesOptions)

        res.status(201).json(
            new ApiResponse(201, loggedInUser, "user register successfully")
        )


    }
    catch(err){
        console.log("error while user login ", err)
        if(err instanceof ApiError){
            next(err)
        }
        throw new ApiError(500 ,"Internal server error")
    }
}

export const userLogout = async(req, res, next) =>{
    try{
        const user = req.user
        if(!user){
             throw new ApiError(401 ,"Unauthorized user")
        }

        res.clearCookie( "accessToken", "", cookiesOptions)
        res.clearCookie( "refreshToken", "", cookiesOptions)
             
        res.status(200).json(
            new ApiResponse(200,  "user logout successfully")
        )

    }catch(e){
         console.log("error while user logout ", err)
        if(err instanceof ApiError){
            next(err)
        }
        throw new ApiError(500 ,"Internal server error")
    }
    
}

export const userProfile = async (req, res, next) => {
    try{
         const user = req.user
         if(!user){
             throw new ApiError(401 ,"Unauthorized user")
        }

        return res.status(200).json(
            new ApiResponse(200, user, "user profile fetch successfully")
        )

    }catch(err){
         console.log("error while user profile ", err)
        if(err instanceof ApiError){
            next(err)
        }
        throw new ApiError(500 ,"Internal server error")
    }
    
}