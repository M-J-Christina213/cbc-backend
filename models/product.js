import mongoose, { Mongoose } from "mongoose";

const productSchema = mongoose.Schema ({
    name: String,
    price: Number,
    Description: String,
    LastPrice: Number
})

const Product = mongoose.model("products", productSchema)

export default Product;