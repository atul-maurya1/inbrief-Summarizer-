import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
        trim: true,  
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "email must required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, "password required"],
        minlength: [6, "password must be atleast 6 character long"],
        select: false
    },
    userType: {
        type: String,
        enum: ["FREE", "BASIC", "PREMIUM"],
        default: "FREE"
    },
    refreshToken: String, 
    

}, {timestamps: true})

userSchema.pre("save", async function(){
     if(!this.isModified("password")) return
     this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign({
         id: this._id,
         email: this.email,
    },
     process.env.REFRESH_TOKEN_SECRET,
     {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
 )
} 
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
        id: this._id,
        email: this.email,
        fullName: this.firstName +' '+ this.lastName,
        userType: this.userType
    },    
         process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
)
}

const User = mongoose.model("User", userSchema)

export default User