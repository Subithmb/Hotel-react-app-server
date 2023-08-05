const express=require('express')
const vendorRouter=express.Router()
const admin=require('../models/Admin')
const vendor=require('../models/Vendor')
const VendorController=require('../controllers/VendorController')
const HotelController=require('../controllers/HotelController')
const upload=require('../middleWare/Multer')
const Auth=require('../middleWare/Auth')

vendorRouter.post('/vendorsignup',VendorController.addVendor)
vendorRouter.post('/vendorlogin',VendorController.VendorLogin) 
vendorRouter.get('/vendorprofile',Auth.VendorAuth,VendorController.getProfile)
vendorRouter.patch('/vendorprofile',Auth.VendorAuth,VendorController.editVendorProfile)
vendorRouter.post('/addcategory',HotelController.Addcategory)
vendorRouter.get('/getcategory',HotelController.getCategory)
vendorRouter.post('/vendorprofile',Auth.VendorAuth,upload.single('image'),VendorController.editProfile)
// need to check after middleware update
vendorRouter.post('/vendorproof',Auth.VendorAuth,upload.single('proof'),VendorController.ProofData)
vendorRouter.post('/addHotel',Auth.VendorAuth, upload.fields([{ name: 'license', maxCount: 1 },{ name:'images', maxCount: 10 }]),HotelController.AddHotel)
vendorRouter.get('/hotelDatas',Auth.VendorAuth,HotelController.hotelData)
vendorRouter.get('/bookingDatas',Auth.VendorAuth,VendorController.BookingData)
vendorRouter.get('/dashbord',Auth.VendorAuth,VendorController.Dashbord)

module.exports=vendorRouter