import ApiError from "../utils/apiError.js"
import jwt from "jsonwebtoken"
import User from '../models/user.model.js'

export const verifyJWT = async (req, _res, next) => {
    try {
        const token = req.cookies?.accessToken
            || req.header("Authorization")?.replace("Bearer ", "").trim()

        if (!token) {
            return next(new ApiError(401, "Authentication required. Please log in."))
        }

        let decoded
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        } catch (jwtErr) {
            if (jwtErr.name === "TokenExpiredError") {
                return next(new ApiError(401, "Session expired. Please log in again."))
            }
            return next(new ApiError(401, "Invalid token. Please log in again."))
        }

        const user = await User.findById(decoded.id).select('-refreshToken -password')
        if (!user) {
            return next(new ApiError(401, "User no longer exists."))
        }

        req.user = user
        next()
    } catch (err) {
        return next(new ApiError(500, "Authentication error"))
    }
}