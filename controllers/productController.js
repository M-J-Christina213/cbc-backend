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

