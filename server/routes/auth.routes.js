import express from "express"

const authRouter = express.Router()

import {userRegister, userLogin, userLogout, userProfile} from "../controller/auth.controller.js"
import {verifyJWT} from '../middleware/auth.middleware.js'

authRouter
          .post("/register", userRegister)
          .post("/login", userLogin)
          .post('/logout', verifyJWT, userLogout)
          .get('/me', verifyJWT, userProfile) 



export default authRouter 