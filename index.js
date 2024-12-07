import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routers/userRouter.js';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import productRouter from './routers/productRouter.js';
import orderRouter from './routers/orderRouter.js';
dotenv.config()

const app = express();

const mongoURL = process.env.MONGO_DB_URI

mongoose.connect(mongoURL,{})
const connection = mongoose.connection;
connection.once("open",()=>
{
  console.log("Database connected.")
})


app.use(bodyParser.json())
app.use((req, res, next) => {
  const token = req.header("authorization")?.replace("Bearer ", "");

  console.log("Received Token:", token);

  if (token != null) {
      jwt.verify(token, process.env.SECRET, (error, decoded) => {
          if (!error) {
              req.user = decoded;
              console.log("Decoded user:", decoded); // Check if admin is decoded
          } else {
              req.user = null;
              console.log("Token verification failed:", error.message);
          }
      });
  } else {
      req.user = null;
  }

  next();
});


app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter)
app.listen(5000, 
    () => {
  console.log("Server is running on port 5000");
});