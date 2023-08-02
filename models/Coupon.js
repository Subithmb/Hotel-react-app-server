const mongoose=require("mongoose")
const couponSchema=new mongoose.Schema({

    CouponName:{ type:String},

    couponCode:{type:String,required:true},
    
    percentage:{type:Number,required:true},

    minimumAmount:{type:Number,required:true},

    validFrom:{type:Date,required:true},
    
    validUpto:{type:Date,required:true},
    
    limit:{type:Number,required:true},

    status:{type:Boolean,default:false}

},{timestamps:true})

module.exports=mongoose.model("Coupon",couponSchema)