const Vendor=require('../models/Vendor')
const User=require('../models/User');
const jwt = require("jsonwebtoken");
const Booking=require('../models/Booking');
const Hotel=require('../models/Hotel')
const cloudinary = require('../middleWare/cloudinary')
const nodemailer = require("nodemailer");


// ............................


const addUser=async(req,res)=>{
  try {
     
      const{name,email,password,phone}=req.body
    const  userData=new User({
      name,email,password,phone
      })
      await userData.save();
      
      if(!userData){
         return res.status(500).json({message:"unable to add user"}) 
      }
     return res.status(201).json({userData})
  } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message })
      
  }}

    // .......................................user login  .............................................
    const UserLogin=async(req,res)=>{
   
        try {
          console.log('cameeeeeeeee');

            let UserSignup = {
                Status: false,
                message: null,
                token: null,
                name: null,
              };
             
            const {email,password}=req.body
           const UserData=await User.findOne({email:email,password:password});
           if(!UserData){
             UserSignup.Status = false;
            UserSignup.message = 'invalid user please check userName or password';
            res.send({ UserSignup });
           }
           if(UserData.status===true){
           
            return res.status(500).json({ message: "Your Email blocked by admin" });

           }else{
       
            if(UserData){
                
               
                UserSignup.Status = true;
                UserSignup.name = UserData.name;
         
          let UserToken =await jwt.sign({ id: UserData._id }, process.env.User_Key, {
            expiresIn: "24h",
          });
          UserSignup.token = UserToken;
          let obj = {
            UserToken,
          };
        

           res.cookie("jwtOfUser", UserToken, {
            httpOnly: false,
            maxAge: 6000 * 1000,
            secure: true, 
            domain: 'empirehotel.netlify.app',
            path: '/',
        }).status(200).send({obj, UserSignup,message:'success...!' })
        

           
             }
           else{
           
            UserSignup.message = "Your Email or Password wrong";
            UserSignup.Status = false;
          res.send({ UserSignup });
           }
          }
            
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: error.message })
            
        }
    }


    
const getProfile=async(req,res,next)=>{
  try {
    

      const userId = req.id
     
      try{
      const userData = await User.findOne({ _id: userId });
      
       
      if (!userData) {
        return res.status(404).json({ error: "user not found" });
      } 
        return res.status(200).json({ userData });
      } catch (error) {
        return res.status(500).json({ error: "Database error" });
      }
   
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// ..................edit profile  ...........................

const editUserProfile= async(req,res)=>{
  try {
    
   const id= req.id

      if(!id){
          throw new Error("Invalid Token")
      }
      const{name,phone,email}=req.body.UserDatas
     
      await User.findByIdAndUpdate({_id:id},{$set:{name:name,phone:phone,email:email}})

      const UserData = await User.findById({_id:id})


      if(!UserData){
          throw new Error("user not found")
      }
    
          res.status(200).send({UserData,message:"success"})

      
  } catch (error) {
      res.status(500).json({error:'Internal server error'});
  }
}




// .................................photo updation

const editProfilePhoto= async(req,res)=>{
  try {
   
     
     const id= req.id

      if(!id){
          throw new Error("Invalid Token")
      }
      const userData = await User.findOne({_id:id})
    

      if(!userData){
          throw new Error("user not found")
      }
      if(req.file&&req.file.path){

        const result = await cloudinary.uploader.upload(req.file.path) 
      
        userData.image=result.secure_url
      
          const url =result.secure_url;
          await userData.save()
      
          res.status(200).send({success:true,url,message:"success"})
      }else{
          throw new Error("No image is there")
      }
      
  } catch (error) {
      res.status(500).json({error:'Internal server error'});
  }
}


// ...........................booking details..............................................


const userBookings=async(req,res)=>{
  try {
   
     if(! req.id){
         throw new Error("Invalid Token")
     }
     const bookingData=await Booking.find({userID:req.id}).populate('hotelID').sort({createdAt:-1})
 
     if(!bookingData){
      throw new Error("no booking found")
  }
  res.status(200).send({bookingData,message:"success"})

  } catch (error) {
    res.status(500).json({error:'Internal server error'});
  }

}

// ......................getSingleBookingData...............................
const userBookingsDetail=async(req,res)=>{
  try {
    
   
     if(! req.id){
         throw new Error("Invalid Token")
     }
     const id=req.query.id
   
     
     const bookingData=await Booking.findById({_id:id}).populate('hotelID')
    
    
     if(!bookingData){
      throw new Error("no booking found")
  }
  res.status(200).send({bookingData,message:"success"})

  } catch (error) {
    res.status(500).json({error:'Internal server error'});
  }

}
// ......................review updating ...............................

const reviewUpdating=async(req,res)=>{
  try { 
    
     if(! req.id){
         throw new Error("Invalid Token")
     }
     const userId= req.id
     const feedback=req.body.review
     const rating=req.body.value
   
     
     const bookingData=await Hotel.findById({_id:req.body.id})
    
     bookingData.review.push({ userId, feedback, rating });

    bookingData.save()
  
     if(!bookingData){
      throw new Error("no booking found")
  }
  res.status(200).send({bookingData,message:"success"})

  } catch (error) {
    res.status(500).json({error:'Internal server error'});
  }

}


// ......................Cancel Booking...............................
const CancelBooking=async(req,res)=>{
  try {
   
    
   
     if(! req.id){
         throw new Error("Invalid Token")
     }
    
     const id=req.query.id
   
     
     const bookingData=await Booking.findById({_id:id}).populate('hotelID')
    console.log(bookingData.BookingStatus,'bookingData');
     if(!bookingData || bookingData.BookingStatus=="cancelled"){
 console.log('fgfhfg');
      return res.status(404).json({message:'data not found'})
     }
     if(bookingData.paymentStatus !==true){
      return res.status(404).json({message:'paymentStatus not true'})
     
  }else{
   
  
    if(bookingData.userID.toString() === req.id.toString())
    {
   
      const UserData = await User.findById({_id:req.id})
   
      UserData.wallet=UserData.wallet+bookingData.UpdatedTotal-bookingData.serviceFee
      UserData.save()
      bookingData.BookingStatus='cancelled'
      bookingData.save()
      
      res.status(200).send({bookingData,message:"success"})
    }
    else{
      res.status(404).json({message:'credentials missMatching'})
    }
  }


  } catch (error) {
    res.status(500).json({error:'Internal server error'});
  }

}



    module.exports={
        addUser,
        UserLogin,
        getProfile,
        editUserProfile,
        editProfilePhoto,
        userBookings,
        userBookingsDetail,
        reviewUpdating,
        CancelBooking

    }