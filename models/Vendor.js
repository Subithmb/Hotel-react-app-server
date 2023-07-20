const mongoose=require("mongoose"); 

// user sign-up schema

const venderSchema = new mongoose.Schema({
    name: {
      type: "String",
      required: true
    },
     email: {
      type: "String",
      required: true
    },
   
    password: {
      type: "String",
      required: true
    },
    proof: {
      type: "String",
     
    },
    brand: {
      type: "String",
      required: true
    },
    phone: {
      type: "number",
      required: true
    },
    
    status: {
      type: "boolean",
      default:false
    },
    proofstatus: {
      type: "boolean",
      default:false
    },
    image:"String",
        
    
  });


 module.exports = mongoose.model("Vendor",venderSchema);
  