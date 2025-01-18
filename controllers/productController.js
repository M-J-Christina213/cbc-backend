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

export function getProducts(req,res){
    Product.find({}).then((products)=>{
        res.json(products)
    })
    .catch((error) => {
        res.status(500).json({
          message: error.message || "An error occurred while fetching the products"
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