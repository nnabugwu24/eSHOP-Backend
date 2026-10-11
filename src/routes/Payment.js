import express from "express";
import axios from "axios";
import { Order } from "..models/Orde.js";


const router = express.Router();

router.post("/initialize", async (req, res, next) => {
    try {
        const { UserId, Products, totalAmount, email } = req.body
        //create an order with status pending
        const Order = new Order({
            UserId,
            Products,
            totalAmount,
            paymentStatus: "pending",
        });
        await Order.save();

        // initialize transcation with paystack
        const response = await axios.post(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
            email,
            amount: totalAmount * 100,
            reference: Order._id.toString(),
            callback_url: "https:// localhost:5000/api/payment",
            verifyOrder: `{Order._id}`// frontend callback url
        },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    "content-Type": "application/json",
                },
            },
        );

        const { authorization_url, reference } = response.data.data;
        // save the reference to order for verification
        Order.paystackReference = reference;
        await Order.save();

        //send payment url to frontend
        res.status(200).json({ authorization_url, reference, OrderId: Order._id });
    } catch (error) {
        console.error(error);
        next(error.res.status(500).json({ message: "payment initialization faild" }));

    };
});

//verify payment
const paymentData = response.data.data;
try{
    if (paymentData.Status === "success") {
    // update order payment status to "paid"
    await Order.findByIdAndUpdate(Order._Id, { paymentStatus: "paid" });
    return res.status(200).json({
        message: "payment successful", paymentData
    })
    } else {
    //payment faild or pending
    await Order.findByIdAndUpdate(Order.Id, { paymentStatus: "failed" });
    return res.status(400).json({ message: "payment verification faild" })
    };
}catch (error) {
    console.error(error);
    res.status(500).json({ message: "payment verification error" })
  };



  //webhook handler endpoint
  // middleware to parse raw body for webhook verification
  app.use("/webhook/paystack", express.raw({type:"/"}));

 app.post("/webhook/paystack", async (req , res, next) => {
    //paystack send signature in header "x-paystack-signature"
    const hash = req.headers["x-paystack-signature"];
    //compute HMAC digest from raw body and secret key
    const hmac = crypto.createHmac("sha512", PAYSTACK_SECRET_KEY);
    hmac.update(req.body);
    const digest = hmac.digest("hex");
    //verify signature
    if (hash !== digest) {
        console.error("invalid paystack webhook signature");
        return res.status(400).send("invalid signature")
    }
    //parse json body from buffer
    let event;
    try {
        event=json.parse(req.body.toString)
    }catch(err) {
        console.error ("Error parsing webhook JSON", err);
        return res.status(400).send("invalid JSON");
    }
    // Handle paystack event
    const eventType = event.event;
    const data = event.data;
    console.log(`Recived paystack webhook event:${eventType}`)
    try {
        switch(eventType) {
            case "charge.success":
            //example: update order status to paid

            const reference = data.reference; //paystack payment reference
            const amount = data.amount/100;  //paystack amount is in kobo for NGN
            const customerEmail = data.customer.email;
            //if order by reference and update status
            const order = await order.findOne({paystackReference:reference});
            if(!order) {
                console.warn('order with reference ${reference}not found');
                break
            }
            order.status = "paid";
            order.amount = "amount";
            order.customerEmail = customerEmail;
            order.updatedAt = new Date();
            await order.save();
            console.log(`order ${order.OrderId} marked as paid`)
            break;

            case "charge failed"

            // Handle faild payment if need
            console.log("payment failed for reference": data.reference)

            // Add more event types as needed
            defaultn:
              console.log("Unhandled event type:", eventType);

        }
          //Respond with 200 to acknowledge receipt
          res.status(200).send("webhook received");
    }catch(err) {
        console.error("Error handling webhhok event:", err);
        next(err.res.status(500).json("server error"))
    }
    
 })


export default router;