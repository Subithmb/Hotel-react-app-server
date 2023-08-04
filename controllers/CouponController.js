const Admin = require("../models/Admin");
const vendor = require("../models/Vendor");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Booking=require('../models/Booking');
const Coupon=require('../models/Coupon')


// .......................add coupon .......................................

const AddCoupon = async (req, res) => {
    try {
       
      const {
        name,
        startDate,
        expiryDate,
        couponCode,
        discountPercentage,
        minBookingAmount,
        limit,
      } = req.body.coupon;
 

      const existingCoupon = await Coupon.findOne({ couponCode: couponCode });
 
      if (existingCoupon) {
        return res.status(404).json({ message: "Coupon exist" });
      }
      
      const  CouponData=new Coupon({
      CouponName : name,
      limit : limit,
      couponCode : couponCode,
      validFrom : startDate,
      validUpto : expiryDate,
      percentage : discountPercentage,
      minimumAmount : minBookingAmount
       
        })
        await CouponData.save();
   
      return res.status(200).json({ CouponData, message: "Coupon updated successfully" });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  

// .........................get all coupon...................................

const AllCoupon = async (req, res) => {
    try {
       
     
      const AllCoupon = await Coupon.find()
 
      if (!AllCoupon) {
        return res.status(404).json({ message: "Coupons not exist" });
      }
      
      return res.status(200).json({ AllCoupon, message: "success" });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };


  const applyCoupon=async(req,res)=>{
    try {
     

      const jwtToken = req.cookies.jwt.UserToken;
   
      const decode=jwt.verify(jwtToken,process.env.User_Key)
     
       if(!decode.id){
           throw new Error("Invalid Token")
       }
      
      
   const couponExist = await Coupon.findOne({couponCode:req.body.couponCode,"users.userId": decode.id }).lean();

  

   const coupons = await Coupon.findOne({ couponCode:req.body.couponCode }).lean();

   if(!coupons){
 
  return res.status(400).json({ message: 'coupon not valid' });
}
  const currentDate = new Date();
   
   if (coupons && coupons.limit>0 )
       
   {
   
     if(couponExist){
           
        return res.status(404).json({ message: 'coupon already Used' });    
     
   }
   if (currentDate > coupons.validUpto) {
       
        return res.status(400).json({ message: " coupon Expired" });   
       
   }

    if (req.body.newTotal < coupons.minimumAmount){
     
         return res.status(400).json({ message: "your total is under the minimum amount" });
        }
  
        // .................  after add coupon take reference.....................
        
        await Coupon.findByIdAndUpdate({_id:coupons._id},
          {
            $push: { users: { userId: decode.id} },
            $inc: { limit: -1 },
          }
        );
  //  const userId = decode.id;
  //           coupons.users.push({ userId }); 
  //           const coupon= await coupons.save();
    res.status(200).json({status:true, message: 'Coupon applied',coupons })
  }

    } catch (error) {
      console.log(error);
      
    }
  }


module.exports={
    AddCoupon,
    AllCoupon,
    applyCoupon
}