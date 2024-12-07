import express from 'express';
import { createProduct, getProducts } from '../controllers/productController.js';
 const productRouter = express.Router();

 productRouter.post("/", createProduct)
 productRouter.get("/", getProducts)

 export default productRouter;