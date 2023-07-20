const express=require('express')
const vendorRouter=express.Router()
const admin=require('../models/Admin')
const vendor=require('../models/Vendor')
const VendorController=require('../controllers/VendorController')
const HotelController=require('../controllers/HotelController')
const multer = require("multer")
const path = require('path')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,"../public/Images"),function(error,success){
            if(error){
                console.log(error);
            }
        })
    },
    filename:function(req,file,cb){
        const name = Date.now()+"-"+file.originalname;
        cb(null,name,function(error,success){
            if(error){
                console.log(error);
            }
        })
    }
})
const upload = multer({storage:storage})

vendorRouter.post('/vendorsignup',VendorController.addVendor)
vendorRouter.post('/vendorlogin',VendorController.VendorLogin)
vendorRouter.get('/vendorprofile',VendorController.getProfile)
vendorRouter.patch('/vendorprofile',VendorController.editVendorProfile)
vendorRouter.post('/addcategory',HotelController.Addcategory)
vendorRouter.get('/getcategory',HotelController.getCategory)
// vendorRouter.post('/vendorprofileimage',VendorController.getProfileimage)
// vendorRouter.get('/vendorprofileimages',VendorController.getProfileimages)
vendorRouter.post('/vendorprofile',upload.single('image'),VendorController.editProfile)
vendorRouter.post('/vendorproof',upload.single('proof'),VendorController.ProofData)
vendorRouter.post('/addHotel', upload.fields([{ name: 'license', maxCount: 1 },{ name:'images', maxCount: 10 }]),HotelController.AddHotel)
vendorRouter.get('/hotelDatas',HotelController.hotelData)

module.exports=vendorRouter