import express from 'express';
import { createProduct, deleteProducts, getProductById, getProducts, searchProducts, updateProduct, getCategoriesAndSubcategories } from '../controllers/productController.js';
 const productRouter = express.Router();

 productRouter.post("/", createProduct)
 productRouter.get("/", getProducts)
 productRouter.get("/search/:query", searchProducts)
 productRouter.get("/:productID", getProductById)
 productRouter.delete("/:productID", deleteProducts)
 productRouter.put("/:productID", updateProduct)
 productRouter.get("/getCat/subCat/new", getCategoriesAndSubcategories)

 export default productRouter;