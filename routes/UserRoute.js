const express=require('express')
const userRouter=express.Router()
const admin=require('../models/Admin')
const vendor=require('../models/Vendor')
const upload=require('../middleWare/Multer')
// const vendor=require('../models/Vendor')
const VendorController=require('../controllers/VendorController')
const UserController=require('../controllers/UserController')
const HotelController=require('../controllers/HotelController')
const PaymentController=require('../controllers/PaymentController')


// const multer = require("multer")
// const path = require('path')
// const storage = multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,path.join(__dirname,"../public/Images"),function(error,success){
//             if(error){
//                 console.log(error);
//             }
//         })
//     },
//     filename:function(req,file,cb){
//         const name = Date.now()+"-"+file.originalname;
//         cb(null,name,function(error,success){
//             if(error){
//                 console.log(error);
//             }
//         })
//     }
// })
// const upload = multer({storage:storage})

userRouter.get('/userHoteldata',HotelController.hotelDataUser)
userRouter.get('/singleHoteldata/:id',HotelController.singleHotelData)
userRouter.post('/register',UserController.addUser)
userRouter.post('/login',UserController.UserLogin)
userRouter.get('/getprofile',UserController.getProfile)
userRouter.patch('/edit',UserController.editUserProfile)
userRouter.get('/bookings',UserController.userBookings)
userRouter.post('/editphoto',upload.single('image'),UserController.editProfilePhoto)
userRouter.post('/orders',PaymentController.orderCreate)
userRouter.post('/verify',PaymentController.verify)


module.exports=userRouter