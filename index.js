
import express from 'express'
const app=express()
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors'
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))



import router from './router/admin-routes.js'
import userrouter from './router/user-routes.js';
//Uploads folder contains all images uploaded by the user
app.use('/uploads',express.static('uploads'))
app.use('/user',userrouter)
app.use('/admin',router)



app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})