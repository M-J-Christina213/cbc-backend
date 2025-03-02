import Review from "../models/review";
import Product from "../models/product";

import Review from "../models/review";
import Product from "../models/product";

// Add a new review for a product
export async function submitReview(req, res) {
  try {
    const { name, email, rating, review } = req.body;
    const { productID } = req.params; // Get the productID from URL params or context

    // Validate the input
    if (!name || !email || !rating || !review || !productID) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the product exists by productID
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
    res.status(201).json({
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding review", error: error.message });
  }
};
