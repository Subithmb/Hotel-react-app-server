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



module.exports={
    AddCoupon,
    AllCoupon
}