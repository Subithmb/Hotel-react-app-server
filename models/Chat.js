const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
      adminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin",
      },
      userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model("Chat", chatSchema);