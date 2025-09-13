const mongoose = require("mongoose");

const userShema = new mongoose.Schema({
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
    }
});

const model = mongoose.model("User", userShema);
module.exports = model;