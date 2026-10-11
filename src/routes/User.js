import express from "express";
import   { User }  from "../model/User.js";
import protect from "../middleware/auth.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// REgister 
router.post("/register", async(req , res, next) =>{
    const { username, email, password } = req.body;

    try {
        const User = await User.create({
            username,
            email,
            password
        });

        res.status(201).json({
            _id: Userser._id,
            username: User.username,
            email: User.email,
            password: User.password,
            isAdmin: User.isAdmin,
        });
    } catch (error) {
       next(err.res.status(500).json({ message: "please fill the form" }));
        
    };

});
//login
router.post("./login",async (req,res,next)=>{
    const {email, password} = req.body;
    try{
        const User = await User.findOne({email});
        if(!User && !(await User.matchPassword(password))){
            return res.status(401).json({message: "Invalid email or password"});

        }
        const isMatch = await User.matchpassword(password);

        if (isMatch) {
            res.status(200).json({
                _id: User._id,
                username: User.username,
                email: User.email,
                password: User.password,
                isAdmin: User.isAdmin,
            });
        }
    }catch(err) {
      next( err.res.status(500).json({message: "Server error"}));
    };
});

//me
router.get("/me", protect,async (req,res,next)=>{
    try{
        const User = await User.findById(req.user._id);
        res.status(200).json(user);
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