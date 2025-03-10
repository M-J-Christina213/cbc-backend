import Review from "../models/review.js"; 
import Product from "../models/product.js"; 


// Controller to handle submitting a review
export async function submitReview(req, res) { 
    try {
      const { name, email, rating, review } = req.body;
      const { productID } = req.params;
  
      console.log("Received Product ID:", productID);
  
      // 🛠 Fix: Use findOne instead of findById since productID is a string
      const product = await Product.findOne({ productID });
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      console.log("Review Data:", { name, email, rating, review });
  
      const newReview = new Review({
        productID,
        name,
        email,
        rating,
        review,
      });
  
      await newReview.save();
  
      return res.status(201).json({
        message: "Review submitted successfully!",
        review: newReview,
      });
    } catch (error) {
      console.error("Error Details:", error.message);
      return res.status(500).json({ message: "Error submitting review", error: error.message });
    }
  }
  
// Controller to get all reviews for a specific product
export async function getReviewsByProduct (req, res) {
  try {
    const { productID } = req.params; 

    // Find reviews for the product
    const reviews = await Review.find({ productID }).populate("productID", "productName"); 

    // Check if there are any reviews
    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this product" });
    }

    // Return the reviews
    return res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving reviews" });
  }
};
