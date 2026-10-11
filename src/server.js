import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import  UserRoutes  from "./routes/UserRoutes.js";
import ProductRoutes from "./routes/ProductRoutes.js";
import OrderRoutes  from "./routes/OrderRoutes.js";
import CartRoutes from "./routes/CartRoutes.js";
import PaymentRoutes from "./routes/PaymentRoutes.js";



const app = express();


dotenv.config();

mongoose
        .connnect(process.env.MONGO_URL)
        .then(()=> console.log("DB Connection Successfull!"))
        .catch((err) => {
            console.log(err.message);
        });

   app.use(express.json());
app.use("/api/User", UserRoutes)
app.use("/api/Product", ProductRoutes)
app.use("/api/Cart", CartRoutes)
app.use("/api/Order", OrderRoutes);
app.use("/api/Payment", PaymentRoutes);


app.listen(process.env.PORT || 5000, () => {

    console.log("Server is running on localhost:5000");
});