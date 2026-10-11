import mongoose from "mongoose";
import bcrypt from "bcrypt";


const UserSchema = new mongoose.Schema({
    username: {
        type: String, require: true, unique: true,
    },
    email: {
        type: String, require: true, unique: true,
    },
    password: {
        type: String, require: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) 
    next();
    
    const salt = await bcrypt.genSalt(10);
    this.password =  bcrypt.hash(this.password, salt);
    next();
});


UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};  
  

export const User = mongoose.model("User", UserSchema);


