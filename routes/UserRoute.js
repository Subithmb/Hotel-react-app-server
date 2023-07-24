const express=require('express')
const userRouter=express.Router()
const admin=require('../models/Admin')
const vendor=require('../models/Vendor')
const upload=require('../middleWare/Multer')
const VendorController=require('../controllers/VendorController')
const UserController=require('../controllers/UserController')
const HotelController=require('../controllers/HotelController')
const PaymentController=require('../controllers/PaymentController')



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