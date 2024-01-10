import { connect } from 'mongoose'
import express, { json  } from 'express'
const app=express()
import { config } from 'dotenv'
import cors from 'cors'
import multer, { diskStorage } from 'multer'
import { join } from "path"
import cookieParser from 'cookie-parser'
import authRoute from './routes/auth'
import userRoute from './routes/users'
import postRoute from './routes/posts'
import commentRoute from './routes/comments'

//database
const connectDB=async()=>{
    try{
        await connect(process.env.MONGO_URL)
        console.log("database is connected successfully!")

    }
    catch(err){
        console.log(err)
    }
}



//middlewares
config()
app.use(json())
app.use("/images",(join(__dirname,"/images")))
app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(cookieParser())
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/posts",postRoute)
app.use("/api/comments",commentRoute)

//image upload
const storage=diskStorage({
    destination:(req,file,fn)=>{
        fn(null,"images")
    },
    filename:(req,file,fn)=>{
        fn(null,req.body.img)
        // fn(null,"image1.jpg")
    }
})

const upload=multer({storage:storage})
app.post("/api/upload",upload.single("file"),(req,res)=>{
    // console.log(req.body)
    res.status(200).json("Image has been uploaded successfully!")
})


app.listen(process.env.PORT,()=>{
    connectDB()
    console.log("app is running on port "+process.env.PORT)
})