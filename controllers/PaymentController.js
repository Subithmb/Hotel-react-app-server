const Vendor=require('../models/Vendor')
const User=require('../models/User');
const Booking=require('../models/Booking');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer')
const Razorpay = require("razorpay");
const crypto = require('crypto');
const { log } = require('console');
require("dotenv").config()
const fs = require('fs');
const path=require('path')
const { format } = require('date-fns');



    const walletpay = async (req, res) => {

       try {
         
        
        // const jwtToken = req.cookies.jwtOfUser;
        // const decode=jwt.verify(jwtToken,process.env.User_Key)
   
         if(!req.id){
             throw new Error("Invalid Token")
         }
         const userID =req.id
         
         if(!userID){
           throw new Error("user not found")
          }
          
        const{name,phone,total,totalDays,checkIn,checkOut,hotelID,guest,newTotal,tax,fee,selectedPaymentMethod,discount}=req.body
      const userData=await User.findById({_id:userID})

      if(!userData){
        throw new Error("user not found")
      }
       userData.wallet=userData.wallet-newTotal
            userData.save();

            const newBooking=new Booking({
              name,bookingId:userID
              , phone, total, totalDays,checkIn,checkOut,userID,hotelID,guest,
              serviceFee:fee,
              paymentStatus:true,
              discount:discount,
              paymentType:selectedPaymentMethod,
              tax,
              UpdatedTotal:newTotal
            })
            const bookedData=await newBooking.save()
           
            res.status(200).json({bookedData})
                
       } catch (error) {
        console.log(error);
       }
}

    const orderCreate = async (req, res) => {

       try {
          //console.log(req.cookies.jwt,'hhhhhhhhhhhhhhhhhhhhh');
         // console.log(req.body);
        // const jwtToken = req.cookies.jwtOfUser;
        // const decode=jwt.verify(jwtToken,process.env.User_Key)
   
         if(!req.id){
             throw new Error("Invalid Token")
         }
         const userID =req.id
         
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

    // if (!req.cookies || !req.cookies.jwtOfUser) {
      
    //   return res.status(401).json({ error: "Unauthorized" });
    // }

    
    // const jwtToken = req.cookies.jwtOfUser;
    // const decodetoken = jwt.verify(jwtToken, process.env.User_Key);

    // console.log('jwt',decodetoken);

      const userId = req.id

   
    const { razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;
    
    const sign= razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign=crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");
      if(razorpay_signature === expectedSign){
        const bookingData=await Booking.findOne({bookingId:razorpay_order_id }).populate('hotelID').populate('userID')
       console.log('dataaaaaa',bookingData);
        if(!bookingData){
          return res.status(404).json({ message: "Booking not found"})
        }
        bookingData.paymentStatus = true;
        bookingData.paymentId = razorpay_payment_id;

        const bookedData = await bookingData.save();




// .......................... mail sending sarted..................................


const nodemailer = require('nodemailer');

// Create a Nodemailer transporter with your email service provider's SMTP configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.user,
    pass: process.env.pass
  }
});

// Compose the email content
// const imagePath = path.join(`${bookingData.hotelID.Images[0]}`);
// const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
// Compose the email content
// const hotelPhotoURL =  // Replace with the URL of the hotel photo  
//   <img src="${hotelPhotoURL}" alt="Hotel Photo" style="max-width: 100%; height: auto;">
// console.log(imageBase64  ,'imageeeeeeeeeeeee');

const hotelPhotoURL = bookingData.hotelID.Images[0]
const hotelName = bookingData.hotelID.Name;
const bookingDate = bookingData.createdAt; 
const checkinDate = bookingData.checkIn; 
const checkoutDate = bookingData.checkOut;
const name = bookingData.name;
const checkinDateFormatted = format(new Date(checkinDate), 'MMMM dd, yyyy'); 
const checkoutDateFormatted = format(new Date(checkoutDate), 'MMMM dd, yyyy');
const bookingDateFormatted = format(new Date(bookingDate), 'MMMM dd, yyyy'); 
const emailContent = `
  <p style="font-size: 24px; font-weight: bold;">Booking Confirmation</p>
  <p>Thank you <strong> ${name}</strong> for new Booking</p>
  <img src=${bookingData.hotelID.Images[0]} alt="Hotel Photo" style="max-width: 100%; height: auto;">
 
  <p><strong>Hotel Name:</strong><h3> ${hotelName}</h3></p>
  <p><strong>Booking Date:</strong> ${bookingDateFormatted}</p>
  <p><strong>Check-in Date:</strong> ${checkinDateFormatted}</p>
  <p><strong>Check-out Date:</strong> ${checkoutDateFormatted}</p>
`;

const mailOptions = {
  from: 'ikeaecom2023@gmail.com',
  to: bookingData.userID. email,
  subject: 'Booking Confirmation',
  html: emailContent,
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent successfully:');
    return res.status(200).json({ message: "Payment verified and mail sent", bookedData });
  }
});
// .......................... mail sending ended..................................





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
    verify,
    walletpay
}