import order from "../models/order.js"
import { isAdmin, isCustomer } from "./userController.js";
import Product from "../models/product.js";

export async function createOrder(req, res) {
   
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    if (!isCustomer(req)) {
        return res.status(403).json({ message: "Please log in as a customer to create orders" });
    }
    
    try {
        const latestOrder = await order.find().sort({ orderId: -1 }).limit(1);
        let orderId;

        if (latestOrder.length == 0) {
            orderId = "CBC0001";
        } else {
            const currentOrderId = latestOrder[0].orderId;

            const numberString = currentOrderId.replace("CBC", "");

            const number = parseInt(numberString);

            const newNumber = (number + 1).toString().padStart(4, "0");
            orderId = "CBC" + newNumber;
        }

        const newOrderData = req.body;
        const newProductArray = []
        // Loop through orderedItems to find corresponding products and create a new array
        for (let i = 0; i < newOrderData.orderedItems.length; i++) {
            const product = await Product.findOne({
                productID: newOrderData.orderedItems[i].productId
            })

            if (!product) {
                return res.status(404).json({ message: `Product with id ${newOrderData.orderedItems[i].productId} not found` });
            }

            if (product.stock < newOrderData.orderedItems[i].qty) {
                return res.status(400).json({ message: `Sorry, not enough stock available for ${product.productName}. Please update your order and try again.` });
            }
            
            // Build the product structure for the new order
            newProductArray[i] = {
                name: product.productName,
                price: product.lastPrice,
                quantity: newOrderData.orderedItems[i].qty,
                image: product.images[0]
            }

            //put another for loop before saving the product from each elemnt if quantity can be reduced - Day 10 - 54:35
        }
        console.log(newProductArray)

        //Reduce product quanities based on order
        for (let i = 0; i < newOrderData.orderedItems.length; i++) {
            const orderedItem = newOrderData.orderedItems[i];

            await Product.updateOne(
                { productId: orderedItem.productId },
                { $inc: { stock: -orderedItem.qty } }
            )
        }


         // Assign the new order details including ordered items
         const newOrder = new order({
            orderId: orderId,
            email: req.user.email,
            orderedItems: newProductArray,
            paymentId: newOrderData.paymentId,
            status: "preparing",
            notes: newOrderData.notes,
            name: newOrderData.name,
            address: newOrderData.address,
            phone: newOrderData.phone,
            date: new Date(),
        });

        await newOrder.save();
        res.status(201).json({ message: "Order created successfully", order: newOrder });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getOrders(req, res) {

    try {
        if (isCustomer(req)) {
            const orders = await order.find({ email: req.user.email })

            res.json(orders)
            return;
        } else if (isAdmin(req)) {
            const orders = await order.find({})
            res.json(orders)
            return;
        } else {
            res.json({
                message: "Please login to view orders"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export async function getQuote(req, res) {


    try {

        const newOrderData = req.body;
        const newProductArray = []
        let total = 0;
        let labeledTotal = 0;


        // Loop through orderedItems to find corresponding products and create a new array

        for (let i = 0; i < newOrderData.orderedItems.length; i++) {
            const product = await Product.findOne({
            // you passed 
                productID: newOrderData.orderedItems[i].productId
            })

            if (product == null) {
                res.json({
                    message: "Product with id " + newOrderData.orderedItems[i].productId + " not found"
                })
                return
            }

            if (product.stock < newOrderData.orderedItems[i].quantity) {
                res.json({
                    message: "Sorry, not enough stock available for " + product.productName + " Please update your order and try again"
                })
            }

            total += product.price * newOrderData.orderedItems[i].qty;
            labeledTotal += product.lastPrice * newOrderData.orderedItems[i].qty;
            // Build the product structure for the new order
            newProductArray[i] = {
                name: product.productName,
                price: product.lastPrice,
                labeledPrice: product.price,
                quantity: newOrderData.orderedItems[i].qty,
                image: product.images[0]
            }

            //put another for loop before saving the product from each elemnt if quantity can be reduced - Day 10 - 54:35
        }
        console.log(newProductArray)

        //Reduce product quanities based on order
        for (let i = 0; i < newOrderData.orderedItems.length; i++) {
            const orderedItem = newOrderData.orderedItems[i];

            await Product.updateOne(
                { productId: orderedItem.productId },
                { quantity: Product.stock - orderedItem.quantity }
            )
        }

        console.log(newProductArray)
        // Assign the new order details including ordered items
        newOrderData.orderedItems = newProductArray
        newOrderData.total = total;

        res.json({
            orderedIems: newProductArray,
            total: total,
            labeledTotal: labeledTotal
        })


    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}