const Admin=require('../models/Admin')
const User=require('../models/User');
const jwt = require("jsonwebtoken");
const Chat=require('../models/Chat')
const Message=require('../models/Message')


const createChat=async(req,res)=>{
    try {

      
        const userId =req.id
        const adminData=await Admin.findOne()
        const adminId=adminData._id

        const chat=await Chat.findOne({adminId,userId})
       

        if(chat){
             return res.status(200).json({chat})
        }
        const newChat=new Chat({ adminId,  userId  })
        
        const response=await newChat.save()
       
        return res.status(200).json({chat:response, message:'created' })
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }

}




const createMessage=async(req,res)=>{
   
    try {
    
       

        const {text,chatId,senderId}=req.body
        
        const message=new Message({
            chatId,senderId,text
        })
        
       const response= await message.save()
       res.status(200).json({response})

    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}


const getMessage=async (req,res)=>{
    try {
        const chatId=req.query.id;
        console.log(chatId);
        const messages=await Message.find({chatId:chatId}).populate('chatId');
        res.status(200).json({messages})

    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}
const getAllMessage=async (req,res)=>{
    try {
       
        const messages=await Message.find().populate('chatId').populate('chatId.userId')
        res.status(200).json({messages})

    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}


const findChats=async(req,res)=>{
   
    try {
       
        const chats=await Chat.find().populate("userId")

        return res.status(200).json({chats})


    } catch (error) {

        res.status(500).json(error)
    }
}


module.exports={
    createChat,
    createMessage,
    getMessage,
    getAllMessage,
    findChats
}