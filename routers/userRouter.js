import express from 'express';
import { createUser, loginUser } from '../controllers/userController.js';


const userRouter = express.Router();

//Below handles the request - /api/users
userRouter.post('/', createUser)

//Below is to handle the request - /api/users/create
userRouter.post('/create', createUser)
//Below handles the request - /api/login
userRouter.post("/login", loginUser)
export default userRouter;