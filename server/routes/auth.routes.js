import express from "express"

const authRouter = express.Router()

import {userRegister} from "../controller/auth.controller.js"

authRouter
          .post("/register", userRegister)



export default authRouter