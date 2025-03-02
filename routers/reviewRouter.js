import express from 'express';
import { submitReview } from '../controllers/reviewController.js';
const reviewRouter = express.Router();

 productRouter.put("/:productID", submitReview)

 export default reviewRouter;