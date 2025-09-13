const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        lowercase:true,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    role:{
        type: String,
        enum: ["user", "admin","volunteer"],
        default: "user"
    },
    otp: {
        type: String,
        trim: true,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    }
});

const model = mongoose.model("User", userSchema);
module.exports = model;
