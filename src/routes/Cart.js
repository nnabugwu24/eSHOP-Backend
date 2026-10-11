import express from "express";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { User }   from  "../models/User.js";
import protect from "../middleware/auth.js";
import jwt from "jsonwebtoken";


const router = express.Router()

// middleware to find or create cart for user
async function getOrCreateCart(UserId) {
    let Cart = awaitCart.findOne({UserId}).populate.items.product
    if(!Cart) {
        Cart = new Cart ({UserId,items:[]});
    }
    return Cart
};


// Get user cart
router.get("/:UserId" , async(req ,res, next) =>{
    const Cart = await getOrCreateCart(req.params.UserId);
    await Cart.save();
    res.json(Cart)
    next(err)
})

//Add product to cart or update quantity
router.post("/:UserId/add", async (req ,res,next) =>{
    const {ProductId,quantity} = req.body
    const UserId = req.User.id
    const Product = await Product.findById(ProductId);
    if(!Product) return res.status(404).json ({ message: "product not found"})
    if(Product.stock < quantity) return res.status(404).json ({message: "Not enugh stock"})
    const Cart = await getOrCreateCart(userId);
    const itemIndex =
       //update quantity
       Cart.items[ itemIndex].quantity += quantity;
     //Add new item
     Cart.items.push({ Product: ProductId, quantity });
     Cart.updatedAt = Date.now();
     await Cart.save();
     res.json(Cart)
    
    next(err)
    
})
//Remove product from cart
router.post("/:UserId/delete" , async(req ,res, next) =>{
    const {Product} = req.body;
    const UserId = req.User.id
    const cart = await getOrCreateCart(UserId);
    Cart.items = cart.items.filter(item= !item.Product.id.equals(Product));
    Cart.updatedAt = Date.now()
    await Cart.save();
    res.json(Cart);
    next(err)
})

//update quantity of a product in cart
router.post("/:UserId/update", async (req ,res,next) =>{
    const { ProductId , quantity } = req.body;
    const UserId = req.User.id;
    if(quantity < 1) return res.status(400).json ({message: "quantity must be at least 1"});
    const Product = await Product.findById(ProductId)
    if(!Product) return res.status(404).json ({
        message: "product not found"
    });
    if (Product.stock < quantity) return res.status(400).json({message: "Not enough stock"});
    const Cart = await getOrCreateCart(userId);
    const itemIndex = cart.items.findIndex(item => item.Product._id.equals(Product));
    if(itemIndex === -1) return res.status(404).json({message:"Product not in cart"});
    Cart.items[itemIndex].quantity = quantity;
    Cart.updatedAt = Date.now();
    await Cart.save();
    res.json(Cart);
    next(err)



});


//Cart auth
router.get("/Cart", protect,async (req,res,next)=>{
    try{
        const Cart = await Cart.findById(req.Product._id);
        res.status(200).json(Cart);
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

export default router
