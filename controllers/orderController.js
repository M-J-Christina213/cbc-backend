import order from "..model/order.js"

export async function createOrder(req,res){

    try{
        const latestOrder = await order.find().sort
        ({date : -1}).limit(1)

        let orderId;

        if (latestOrder.length==0){
            orderId = "CBC0001"
        }else{
            const currentOrderId = latestOrder[0].
            orderId

            const numberString = currentOrderId.replace("CBC", "")

            const number = parseInt(numberString)

            const newNumber= (number + 1).toString().padStart(4, "0");

            orderId = "CBC" + newNumber

        }

        const newOrderData = req.body 
       

    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }

}