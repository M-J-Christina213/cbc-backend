import order from "../models/order.js"
import { isCustomer } from "./userController.js";
import Product from "../models/product.js";
export async function createOrder(req, res) {
    if (!isCustomer) {
        return res.json({
            message: "Please login as customer to create orders"
        });
    }

    try {
        const latestOrder = await order.find().sort({orderId: -1 }).limit(1);
        let orderId;

        if (latestOrder.length == 0) {
            orderId = "CBC0001";
        } else {
            const currentOrderId = latestOrder[0].orderId;

            const numberString = currentOrderId.replace("CBC","");

            const number = parseInt(numberString);

            const newNumber = (number + 1).toString().padStart(4, "0");
            orderId = "CBC" + newNumber;
        }

        const newOrderData = req.body;
        const newProductArray = []
// Loop through orderedItems to find corresponding products and create a new array
        for (let i=0;i<newOrderData.orderedItems.length;i++){
            const product = await Product.findOne({
                productId: newOrderData.orderedItems[i].productId
            })

            if(product==null){
                res.json({
                    message : "Product with id " + newOrderData.orderedItems[i].productId + " not found"
                })
                return
            }

            if (product.stock < newOrderData.orderedItems[i].quantity){
                res.json({
                    message: "Sorry, not enough stock available for " + product.productName + " Please update your order and try again"
                })
            }
 // Build the product structure for the new order
            newProductArray[i] = {
                name : product.productName,
                price : product.price,
                quantity : newOrderData.orderedItems[i].quantity,
                image : product.images[0]
            }

            //put another for loop before saving the product from each elemnt if quantity can be reduced - Day 10 - 54:35
        }
        console.log(newProductArray)

        //Reduce product quanities based on order
        for (let i=0; i <newOrderData.orderedItems.length;i++){
            const orderedItem = newOrderData.orderedItems[i];

            await Product.updateOne(
                { productId : orderedItem.productId },
                {quantity: Product.stock- orderedItem.quantity }
            )
        }


         // Assign the new order details including ordered items
        newOrderData.orderedItems = newProductArray

        newOrderData.orderId = orderId;
        newOrderData.email = req.user.email;

        const newOrder = new order(newOrderData);
        await newOrder.save()

        res.json({
            message : "Order created"
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

export async function getOrders(req,res){
    try{
        const orders = await order.find({email: req.user.email})

        res.json(orders)
    
    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
}