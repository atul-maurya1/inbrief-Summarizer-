import mongoose from "mongoose"


const connectDB = async () => {

    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("✅ DB connected Successfully: ", conn.connection.host)

    }catch(err){
      console.log("❌ DB connection failed: ", err)
      process.exit(1) // Exit process with failure
    }

}

export default connectDB