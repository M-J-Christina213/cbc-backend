import express from 'express';
import { getReviewsByProduct, submitReview } from '../controllers/reviewController.js';
const reviewRouter = express.Router();

 // Route to submit a review for a product
reviewRouter.post("/:productID", submitReview);

// Route to get reviews of a specific product
reviewRouter.get("/:productID", getReviewsByProduct);

export default reviewRouter;