import express from 'express';
import { createProduct, deleteProducts, getProductById, getProducts, searchProducts, updateProduct } from '../controllers/productController.js';
 const productRouter = express.Router();

 productRouter.post("/", createProduct)
 productRouter.get("/", getProducts)
 productRouter.get("/search/:query", searchProducts)
 productRouter.get("/:productID", getProductById)
 productRouter.delete("/:productID", deleteProducts)
 productRouter.put("/:productID", updateProduct)

 export default productRouter;