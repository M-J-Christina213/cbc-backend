import express from 'express';

import { createStudent, deleteStudent, getStudent } from '../controllers/studentController.js';

const studentRouter = express.Router();

studentRouter.get("/", getStudent)

studentRouter.post("/", createStudent);

studentRouter.delete("/", deleteStudent);

export default studentRouter;