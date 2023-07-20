const mongoose=require("mongoose"); 
const { required } = require('nodemon/lib/config');
// admin schema


  const categorySchema = new mongoose.Schema({
    categoryname: {
      type: "string",
      required: true,
    }
  });

 module.exports = mongoose.model("category",categorySchema);

  