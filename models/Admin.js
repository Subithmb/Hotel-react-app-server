const mongoose=require("mongoose"); 
const { required } = require('nodemon/lib/config');
// admin schema


  const adminSchema = new mongoose.Schema({
    name: {
      type: "string",
      required: true,
    },
    email: {
      type: "String",
      required: true,
    },
    password: {
      type: "String",
      required: true,
    },
    status: {
      type: "boolean",
     
      default:true
    },
  });

 module.exports = mongoose.model("admin",adminSchema);

  