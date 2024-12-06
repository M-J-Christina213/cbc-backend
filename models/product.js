import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    productID : {
        type: String,
        required : true,
        unique : true
    },
    productName : {
        type : String,
        required : true
    },
    altName : [
        {
            type : String
        }
    ]
    ,
    //altnames and images are arrays defined inside of []
    images : [
        {
            type : String
        }
    ],
    price : {
        type : Number,
        required : true
    },
    lastPrice : {
        type : Number,
        required : true
    },
    stock : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    }
})

const Product = mongoose.model("products", productSchema);
export default Product;