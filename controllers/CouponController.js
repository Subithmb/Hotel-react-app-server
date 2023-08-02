const Admin = require("../models/Admin");
const vendor = require("../models/Vendor");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Booking=require('../models/Booking');
const Coupon=require('../models/Coupon')


// .......................add coupon .......................................


// const AddCoupon=async(req,res)=>{
//     try {
//         console.log(req.body.coupon);
//         const{name,startDate,expiryDate,couponCode, discountPercentage,minBookingAmount,limit}=req.body.coupon
// console.log(name,req.body.coupon.name);
//         const CouponData =await Coupon.findOne({couponCode:couponCode });
//         CouponData.CouponName=name
//         CouponData.limit=limit
//         CouponData.validFrom=startDate
//         CouponData.validUpto=expiryDate
//         CouponData.percentage=discountPercentage
//         CouponData.minimumAmount=minBookingAmount
        
//         await CouponData.save();

//         return res.status(200).json({CouponData, message: "Coupon added successfully" });

//     } catch (error) {
//         console.log(error.message);
        
//     }
// }

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
    //   existingCoupon.CouponName = name;
    //   existingCoupon.limit = limit;
    //   existingCoupon.couponCode = couponCode;
    //   existingCoupon.validFrom = startDate;
    //   existingCoupon.validUpto = expiryDate;
    //   existingCoupon.percentage = discountPercentage;
    //   existingCoupon.minimumAmount = minBookingAmount;
  
    //   await existingCoupon.save();
//   console.log(existingCoupon,'uiiiiiii');
      return res.status(200).json({ CouponData, message: "Coupon updated successfully" });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  



module.exports={
    AddCoupon
}