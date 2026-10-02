import ApiError from '../utils/apiError.js'
import ApiResponse from '../utils/apiRespone.js'
import User from "../models/user.model.js"

const cookiesOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'strict',
}

const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) throw new ApiError(404, "User not found")

        const refreshToken = await user.generateRefreshToken()
        const accessToken = await user.generateAccessToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { refreshToken, accessToken }
    } catch (err) {
        if (err instanceof ApiError) throw err
        console.error("Error generating tokens:", err)
        throw new ApiError(500, "Internal server error")
    }
}

export const userRegister = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body

        if (!firstName || !email || !password || !confirmPassword) {
            return next(new ApiError(400, "All fields are required"))
        }

        if (password !== confirmPassword) {
            return next(new ApiError(400, "Password and confirm password do not match"))
        }

        const isExists = await User.findOne({ email })
        if (isExists) {
            return next(new ApiError(409, "An account with this email already exists"))
        }

        const user = await User.create({ firstName, lastName, email, password })
        const { accessToken, refreshToken } = await generateTokens(user._id)
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        res.cookie("accessToken", accessToken, cookiesOptions)
        res.cookie("refreshToken", refreshToken, cookiesOptions)

        return res.status(201).json(
            new ApiResponse(201, loggedInUser, "Account created successfully")
        )
    } catch (err) {
        return next(err instanceof ApiError ? err : new ApiError(500, "Internal server error"))
    }
}

export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return next(new ApiError(400, "Email and password are required"))
        }

        const user = await User.findOne({ email })
        if (!user) {
            return next(new ApiError(401, "Invalid email or password"))
        }

        const isPasswordCorrect = await user.comparePassword(password)
        if (!isPasswordCorrect) {
            return next(new ApiError(401, "Invalid email or password"))
        }

        const { accessToken, refreshToken } = await generateTokens(user._id)
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        res.cookie("accessToken", accessToken, cookiesOptions)
        res.cookie("refreshToken", refreshToken, cookiesOptions)

        return res.status(200).json(
            new ApiResponse(200, loggedInUser, "Logged in successfully")
        )
    } catch (err) {
        return next(err instanceof ApiError ? err : new ApiError(500, "Internal server error"))
    }
}

export const userLogout = async (req, res, next) => {
    try {
        const user = req.user
        if (!user) {
            return next(new ApiError(401, "Unauthorized"))
        }

        // Clear refresh token from DB
        await User.findByIdAndUpdate(user._id, { $unset: { refreshToken: 1 } }, { new: true })

        const clearOptions = { ...cookiesOptions, maxAge: 0 }
        res.clearCookie("accessToken", clearOptions)
        res.clearCookie("refreshToken", clearOptions)

        return res.status(200).json(
            new ApiResponse(200, null, "Logged out successfully")
        )
    } catch (err) {
        return next(err instanceof ApiError ? err : new ApiError(500, "Internal server error"))
    }
}

export const userProfile = async (req, res, next) => {
    try {
        const user = req.user
        if (!user) {
            return next(new ApiError(401, "Unauthorized"))
        }

        return res.status(200).json(
            new ApiResponse(200, user, "Profile fetched successfully")
        )
    } catch (err) {
        return next(err instanceof ApiError ? err : new ApiError(500, "Internal server error"))
    }
}