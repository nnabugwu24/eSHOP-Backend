import mongoose from "mongoose";


const OrderItemSchema = new mongoose.Schema({
    Product:{type:mongoose.Schema.Types.ObjectId,ref:"product",required: true },
    quantity:{ type:Number,required: true },
    priceAtPurchase: { type: Number, required:true} // store price at purchase time
})

const OrderSchema = new mongoose.Schema ({
    userId : { type: String, required: true},
    items: [ OrderItemSchema],
    //amount:{ type: Number, required: true},
    totalAmount: {type: Number, required:true},
    status : { type: String,default: pending}, //  use to notify pending,shipped, delivered or  cancelled 
    paymentMethod: { type: String, required: true}, // store payment method used for the order
    paymentStatus: { type: String, enu:["pending","paid","failed"], default: "pending"}, // store payment status
    paystackReference: {type: String }, // store paystack reference for the transaction
    

},
 { timestamps:true}
);
  export const Order = mongoose.model("Order",OrderSchema)

  