import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import productRouter from './routers/productRouter.js';
import userRouter from './routers/userRouter.js';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config()

const app = express();

const mongoURL = ""

mongoose.connect(mongoURL,{})
const connection = mongoose.connection;
connection.once("open",()=>
{
  console.log("Database connected.")
})


app.use(bodyParser.json())
app.use(
  (req,res,next)=>{

    const token = req.header("authorization")?.replace("Bearer ","")

    console.log(token)

    if(token != null){
      jwt.verify(token, "cbc-secret-key-7973" , (error, decoded)=>{
        if(!error){
          
          req.user = decoded 
        }
      })
    }

    next()

  }
)

app.use("/api/products", productRouter)
app.use("/api/users", userRouter)

app.listen(5000, 
    () => {
  console.log("Server is running on port 5000");
});