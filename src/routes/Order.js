import express from "express";
import protect from "../middleware/auth.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Cart }  from  "../models/Cart.js";
import { User }  from  "../models/User.js";
import jwt from "jsonwebtoken";


const router = express.Router()



// place an order from cart
router.post("/:userId/place", async (req , res, next) =>{
    const userId = req.user.id;
    const Cart = await Cartmodels.findOne({userId}).populate("items.Product");
    if(!Cart|| Cart.items.length === 0) return res.status(400).json ({message:"Cart is empty"});
    //calcu;ate total and check stock
    let totalAmount = 0;
    for (const item of Cart.items) {
        if(item.Product.stock < item.quantity) {
            return res.status(400).json ({message:`Not enough stock for product ${item.Product.name}`});

        }
        totalAmount += item.quantity * item.Product.price;
        
    };

    // Deduct stock
    for(const item of Cart.items) {
        item.Product.stock -= item.quantity;
        await item.Product.save();
    };
    // create order item
    const Orderitems = Cart.items.map(item => ({
        Product: item.Product._id,
        quantity: item.quantity,
        priceAtPurchase : item.Product.price

    }));

    // create order
    const Order = new Ordermodels({

        userId,
        items : Orderitems,
        totalAmount : "amount",
        status : "pending",
    });
    await Order.save();

    // clear cart
    Cart.items = [] ;
    await Cart.save();
    res.status(201).json(Order);


  next();
});

//Get order for use

router.get("/:userId" , async (req,res,next) =>{
    const Order = await Order.find ({UserId}).populate.items.product;
    res.json(Order);
    next();
});

//Order auth
router.get("/Order", protect,async (req,res,next)=>{
    try{
        const Order = await Order.findById(req.order._id);
        res.status(200).json(Order);
    }catch(err) {
       next(err.res.status(500).json({message: "Server error"}));
    }
});
// Define the data you want to store inside the token (payload)
const UserPayload = {
    UserId : "Emmanuel",
    email : "chemezieorji4@gmail.com",
    role : "admin"

};

// Generate the token
function generateAccessToken(UserPayload) {
    return jwt.sign(UserPayload, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
} 

 const token = generateAccessToken(UserPayload);
 console.log("Generate JWT Token:", token);


export default router;
