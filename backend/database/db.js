const mongoose = require("mongoose");

const connectToDb = async ()=>{
    try{
       await mongoose.connect(process.env.mongo_url,{
         family:4,
         serverSelectionTimeoutMS: 30000 
       });
       console.log("mongodb was connected successfully!....");
       
    } catch{
       console.log(`mongodb connection failed!....`);
       process.exit(1);
    }
}

module.exports = connectToDb;