import express from 'express';
import { getProduct, createProduct, deleteProduct, getProductByName } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get('/', getProduct);
productRouter.get("/:name", getProductByName)

productRouter.get("/filter", (req,res)=>{
    res.json({
        message : "This is product filtering area"
    })
})
productRouter.post('/', createProduct);
productRouter.delete('/:name', deleteProduct);

export default productRouter;