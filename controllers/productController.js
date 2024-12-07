import Product from "../models/product.js";

export function createProduct(req,res){
    // ! is used to check if isAdmin is false
    if(!isAdmin(req)){
        res.json({
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
        res.json({
            message: error
        })
    })
    
}
