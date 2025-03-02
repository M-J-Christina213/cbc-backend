import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productID: {
    type: String,
    ref: 'Product',  
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;  
