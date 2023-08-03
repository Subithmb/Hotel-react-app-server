const mongoose=require("mongoose"); 

// user sign-up schema

const userSchema = new mongoose.Schema({
    name: {
      type: "String",
      // required: true
    },
     email: {
      type: "String",
      required: true
    },
   
    password: {
      type: "String",
      // required: true
    },
    otp: {
      type: "String"
    },
   
    phone: {
      type: "number",
      // required: true
    },
    wallet: {
      type: "number",
      default:0
    },
    
    status: {
      type: "boolean",
      default:false
    },
   
    image:"String",
        
    
  });


 module.exports = mongoose.model("User",userSchema);
  