const Vendor=require('../models/Vendor')
const User=require('../models/User');
const Booking=require('../models/Booking');
const jwt = require("jsonwebtoken");

const Razorpay = require("razorpay");
const crypto = require('crypto');
const { log } = require('console');
require("dotenv").config()


    const orderCreate = async (req, res) => {

       try {
          //console.log(req.cookies.jwt,'hhhhhhhhhhhhhhhhhhhhh');
         // console.log(req.body);
        const jwtToken = req.cookies.jwt.UserToken;
        const decode=jwt.verify(jwtToken,"secretCodeforUser")
   
         if(!decode.id){
             throw new Error("Invalid Token")
         }
         const userID =decode.id
         
         if(!userID){
           throw new Error("user not found")
          }
          
        const{name,phone,total,totalDays,checkIn,checkOut,hotelID,guest,newTotal,tax,fee}=req.body


        let instance = new Razorpay({ key_id:process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
      
        const options = {
            amount: newTotal*100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
          };
          
           instance.orders.create(options,(error,order)=>{
            if(error){
              console.log(error);
              return res.status(500).json("something  went wrong!")
            }
            
            const newBooking=new Booking({
              name,bookingId:order.id
              , phone, total, totalDays,checkIn,checkOut,userID,hotelID,guest,
              serviceFee:fee,
              tax,
              UpdatedTotal:newTotal
            })
            const bookedData=newBooking.save()
            res.status(200).json({data:order,bookedData})
          
            })
       } catch (error) {
        console.log(error);
       }
}

const verify=async (req,res)=>{
  try {
   
    const { razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;
    
    const sign= razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign=crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");
      if(razorpay_signature === expectedSign){
        const bookingData=await Booking.findOne({bookingId:razorpay_order_id })
       
        if(!bookingData){
          return res.status(404).json({ message: "Booking not found"})
        }
        bookingData.paymentStatus = true;
        bookingData.paymentId = razorpay_payment_id;

        const bookedData = await bookingData.save();

        return res.status(200).json({ message: "Payment verified", bookedData });

      }else{

        return res.status(400).json({ message: "Invalid signature sent!" });
      }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal server error!" });
    
  }
}


module.exports={
    orderCreate,
    verify
}