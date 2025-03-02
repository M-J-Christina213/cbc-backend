import Review from "../models/review"; 
import Product from "../models/product"; 


// Controller to handle submitting a review
export async function submitReview(res,req) {
  try {
    const { name, email, rating, review } = req.body;
    const { productID } = req.params; 

    // Check if the product exists
    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create a new review
    const newReview = new Review({
      productID,
      name,
      email,
      rating,
      review,
    });

    // Save the review to the database
    await newReview.save();

    // Return success response
    return res.status(201).json({
      message: "Review submitted successfully!",
      review: newReview,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error submitting review" });
  }
};

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
