const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    
    chatId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
    },
    senderId:{
        type:String,
    },
    text:{
        type:String,
    },
},{
    timestamps:true,
});

module.exports = mongoose.model("Message", messageSchema);