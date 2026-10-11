import mongoose from "mongoose";


const CartItemSchema = new mongoose.Schema({
    Product:{type:mongoose.Schema.Types.ObjectId,ref:"product",required: true },
    quantity:{ type:Number,default:1 },
})
const CartSchema = new mongoose.Schema({
UserId : { type: String, required:true,unique:true}, // Assuming one cart per user
items : [CartItemSchema],
},
 { timestamps:true}
);
  export const Cart = mongoose.model("Cart",CartSchema)
  