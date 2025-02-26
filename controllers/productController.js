import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export function createProduct(req,res){
    // ! is used to Check if the user is an admin
    if(!isAdmin(req)){
        return res.status(403).json({
          message : "Please login as adminstrator to add products"
        })
            
        
    }
    const newProductData = req.body

    const product = new Product(newProductData)
    console.log(product);
    product.save().then(()=>{
      res.json({
        message: "Product created"
      })
    }).catch((error)=>{
        res.status(403).json({
            message: error.message || "An error occurred while adding the product"
        })
    })
    
}

export function getProducts(req, res) {
  const { category } = req.query; // Extract category from query params
  console.log("Category filter received:", category); // Debugging

  const filter = category ? { category: category } : {}; // Apply category filter

  Product.find(filter)
      .then((products) => {
          console.log("Fetched products:", products.length); // Log number of products found
          res.json(products);
      })
      .catch((error) => {
          console.error("Error fetching products:", error); // Log the error
          res.status(500).json({
              message: error.message || "An error occurred while fetching the products",
          });
      });
}



export function deleteProducts (req,res){
    if(!isAdmin(req)){
        return res.status(403).json({
          message : "Please login as adminstrator to add products"
        })     
        
    }

    const productId = req.params.productId

    Product.deleteOne(
        {productId : productId}
    ).then(()=>{
        res.json({
            message : "Product Deleted"
        })
    }) .catch((error) => {
        res.status(403).json({
          message: error.message || "An error occurred while deleting the product"
        });
      });
}

export function updateProduct(req, res) {
  if (!isAdmin(req)) {
      return res.status(403).json({
          message: "Please login as administrator to update products"
      });
  }

  const productId = req.params.productId;
  let newProductData = req.body;

  // Ensure productID is excluded from the update data
  if (newProductData.productId) {
      delete newProductData.productId;
  }

  // Now, update the product with the filtered data
  Product.updateOne(
      { productId: productId },  // Find product by productId
      newProductData,  // Only update the other fields
  )
  .then(() => {
      res.json({
          message: "Product with " + productId + " updated successfully",
      });
  })
  .catch((error) => {
      res.status(500).json({
          message: error.message || "An error occurred while updating the product"
      });
  });
}

export async function getProductById(req, res) {
  try {
      const productId = req.params.productID;
      console.log("Product ID received:", productId);

      const product = await Product.findOne({ productID: productId });

      if (!product) {
          return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
  } catch (error) {
      console.error("Error fetching product:", error.message);
      res.status(500).json({ error: "An internal server error occurred." });
  }
}

export async function searchProducts(req, res) {
    const query = req.params.query;
  
    try {
      let products;
      if (!query || query.trim() === "") {
        // If search query is empty, return all products
        products = await Product.find({});
      } else {
        // If search query is provided, perform search
        products = await Product.find({
          $or: [
            { productName: { $regex: query, $options: "i" } },
            { altNames: { $regex: query, $options: "i" } },
          ],
        });
      }
  
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error.message);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  }
  