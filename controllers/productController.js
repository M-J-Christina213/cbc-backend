import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export function createProduct(req,res){
    // ! is used to Check if the user is an admin
    if(!isAdmin(req)){
        res.json({
            message : "Please login as adminstrator to add products"
        });
    }
    const newProductData = req.body

    const product = new Product(newProductData)

    product.save().then(()=>{
      res.json({
        message: "Product created"
      })
    }).catch((error)=>{
        res.status(403).json({
            message: error
        })
    })
    
}

export function getProducts(req,res){
    Product.find({}).then((products)=>{
        res.json(products)
    })
}
