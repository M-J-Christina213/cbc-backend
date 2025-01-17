import express from 'express';
import { createProduct, deleteProducts, getProducts, updateProduct } from '../controllers/productController.js';
 const productRouter = express.Router();

 productRouter.post("/", createProduct)
 productRouter.get("/", getProducts)
 productRouter.delete("/:productID", deleteProducts)
 productRouter.put("/:productID", updateProduct)
 export default productRouter;