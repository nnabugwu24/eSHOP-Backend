import mongoose from "mongoose"


const ProductSchema = new mongoose.Schema({

    title:{ type:String, required: true, unique: true },
    description:{ type:String, required: true},
    img: { type: String, required: true },
    categories: { type:Array },
    size: { type: String },
    color: { type: String },
    price: { type: Number, required:true },
    stock: {type: Number, default: 0}
},
  {timestamps: true}
);
 export const Product = mongoose.model("Product", ProductSchema);