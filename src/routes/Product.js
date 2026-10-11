import express from "express";
import { Product } from "../models/Product.js";
import { User } from  "../models/User.js";
import protect from "../middleware/auth.js";
import jwt from "jsonwebtoken";

const router = express.Router();
// Get all products
router.get("/" , async (req,res, next) =>{
    try {
    const Product = await Product.find();
     res.json(Product)
     } catch(err) {
        next(err.res.status(500).json({message: "product not find"}))
     };
 });

// create a product
router.post("/" , async (req, res,next) =>{
    const {name,description,img, categories,price,stock} = req.body;
    try{
    const Product = new Product({ name, description,img,categories,price,stock}); 
    await Product.save();
    res.status(201).json(Product);
    }catch(err){
        next(err.res.status(500).json({message:"product not created"}))

    }
})
//Get single product
router.get("/:id",async (req,res, next) =>{
    const Product = await Product.findById(req.params.id);
    try{
        if (!Product) return res.status(404).json ({message:"product not found"});
        res.json(Product)

    }catch(err){
        next(err)
    }

})

//update product
router.put("/:id" , async (req , res ,next) => {
    const Product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true});
    try{
        if(!Product) return res.status(404).json({message:"product not found"});
        res.json(Product);

    }catch(err){
        next(err)
    };
});

//Delete product

router.delete("/:id" , async (req,res,next)=>{
    const Product = await Product.findByIdAndDelete(req.params.id);
    try{
        if(!Product) return res.status(404).json({message:"product not found"})
            res.json({message: "product deleted"})

    }catch(err) {
        next(err)
    };
});

//Product auth
router.get("/Product", protect,async (req,res,next)=>{
    try{
        const Product = await Product.findById(req.Product._id);
        res.status(200).json(Product);
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