import order from "../models/order.js"
import { isCustomer } from "./userController.js";

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

        for (let i=0;i<req.body.orderedItems.length;i++){
            console.log(req.body.orderedItems[i])
        }
/*
        {
            "productID": "B20001",
            "price": 24.99,
            "stock": 10,
            "image" : "https://example.com/images/handcream.jpeg"
          }
*/
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