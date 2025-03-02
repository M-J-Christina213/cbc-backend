import mongoose from "mongoose";


const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Remove extra spaces around the name
  },
  email: {
    type: String,
    required: true,
    trim: true, 
    lowercase: true, 
  },
  rating: {
    type: Number,
    required: true,
    min: 1, // Minimum rating is 1
    max: 5, // Maximum rating is 5
  },
  review: {
    type: String,
    required: true,
    trim: true, // Remove extra spaces around the review
  },
  date: {
    type: Date,
    default: Date.now, 
  },
});

// Create and export the Review model
const Review = mongoose.model('Review', reviewSchema);
export default Review;

