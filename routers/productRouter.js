import express from 'express';
import { createProduct, deleteProducts, getProducts } from '../controllers/productController.js';
 const productRouter = express.Router();

 productRouter.post("/", createProduct)
 productRouter.get("/", getProducts)
 productRouter.delete("/:productId", deleteProducts)

 export default productRouter;