const Vendor=require('../models/Vendor')
const User=require('../models/User');
const jwt = require("jsonwebtoken");
const Booking=require('../models/Booking');
const Hotel=require('../models/Hotel')
const cloudinary = require('../middleWare/cloudinary')
const nodemailer = require("nodemailer");
// var otp
// ...............................add user ..................

// const addUser=async(req,res)=>{
//     try {
     
//         const{name,email,password,phone}=req.body
//         const UserExist=await User.findOne({email:email});
       
//         if(!UserExist){
//         }
        
//       const  UserData=new User({
//         name,email,password,phone
//         })
//         await UserData.save();
        
//         if(!UserData){
//            return res.status(500).json({message:"unable to add user"}) 
//         }
//        return res.status(200).json({UserData,message:'success'})
//     } catch (error) {
//         console.log(error.message);
        
//     }}



// Function to generate a random OTP of length 6
function generateOTP() {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

// Function to send OTP via email using Node Mailer
async function sendOTP(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });

    const mailOptions = {
      from: "ikeaecom2023@gmail.com",
      to: email,
      subject: "OTP Verification",
      html:`<p>Your Hotel OTP is  <span  style="font-size:24px;font-weight:bold;">  ${otp} </span> .It will expire in 3 minutes, Do not share with others</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.log("Error sending email:", error.message);
  }
}

// Function to verify the OTP provided by the user
async function verifyOTP(userOTP, email) {
  const user = await User.findOne({ email: email });

  if (!user || user.otp !== userOTP) {
    return false;
  }

  // Clear the OTP field in the user document to prevent reuse
  user.otp = undefined;
  await user.save();

  return true;
}

const otpSending = async (req, res) => {
  try {
    const {email} = req.body;
    const UserExist = await User.findOne({ email: email });
    console.log(UserExist);

    if (UserExist) {
      // Generate OTP
      return res.status(500).json({ message: "User already exists" })
    }
     const otp = generateOTP();

      // Send OTP via email
      await sendOTP(email, otp);
      
      // const isOTPValid = await verifyOTP(otp, email);
      // if (!isOTPValid) {
      //   return res.status(400).json({ message: "Invalid OTP" });
      // }

        const UserData = new User({
          email,
          otp,
        });
        await UserData.save();
      

      // Save the OTP to the database (Optional: You can create a new collection to store OTPs)

      return res.status(200).json({ message: "otp send successfully" });
    // } else {
    //   return res.status(409).json({ message: "User already exists" });
    // }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Unable to send otp" });
  }
};



// ............................

const addUser = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, phone,otp } = req.body;
    // const UserExist = await User.findOne({ email: email });

    // if (!UserExist) {
      // Generate OTP
      // const otp = generateOTP();

      // Send OTP via email
      // await sendOTP(email, otp);

      const isOTPValid = await verifyOTP(otp, email);
      console.log(isOTPValid,'isOtpvalid');
      if (!isOTPValid) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

        const UserData =await User.findOne({email:email });

         UserData.name=name
         UserData.password=password
         UserData.phone=phone
         
       
        await UserData.save();
      

      // Save the OTP to the database (Optional: You can create a new collection to store OTPs)

      return res.status(200).json({UserData, message: "User registered successfully" });
    // } else {
    //   return res.status(409).json({ message: "User already exists" });
    // }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Unable to add user" });
  }
};


    // .......................................user login  .............................................
    const UserLogin=async(req,res)=>{
   
        try {
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
            // UserSignup.message = "Your Email blocked by admin";
            return res.status(500).json({ message: "Your Email blocked by admin" });

           }else{
       
            if(UserData){
                
               
                UserSignup.Status = true;
                UserSignup.name = UserData.name;
         
          let UserToken = jwt.sign({ id: UserData._id }, process.env.User_Key, {
            expiresIn: "24h",
          });
          UserSignup.token = UserToken;
          let obj = {
            UserToken,
          };
          res
            .cookie("jwtOfUser", obj, {
              httpOnly: false,
              maxAge: 6000 * 1000,
            })
            .status(200).send({ UserSignup,message:'success...!' })
             }
           else{
           
            UserSignup.message = "Your Email or Password wrong";
            UserSignup.Status = false;
          res.send({ UserSignup });
           }
          }
            
        } catch (error) {
            console.log(error.message);
            // UserSignup.Status = false;
            // UserSignup.message = error;
            // res.send({ UserSignup });
            
        }
    }


    
const getProfile=async(req,res,next)=>{
  try {
    
    if (!req.cookies || !req.cookies.jwtOfUser.UserToken) {
      
      return res.status(401).json({ error: "Unauthorized" });
    }

    
    const jwtToken = req.cookies.jwtOfUser.UserToken;
    const decodetoken = jwt.verify(jwtToken, process.env.User_Key);

    // console.log('jwt',decodetoken);

      const userId = decodetoken.id;
     
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
    return res.status(403).json({ error: "Token verification failed" });
  }
}


// ..................edit profile  ...........................

const editUserProfile= async(req,res)=>{
  try {
    
    const jwtToken = req.cookies.jwtOfUser.UserToken;
    const decode=jwt.verify(jwtToken,process.env.User_Key)
   const id=decode.id

      if(!decode.id){
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
   
     const jwtToken = req.cookies.jwtOfUser.UserToken;
     const decode=jwt.verify(jwtToken,process.env.User_Key)

      if(!decode.id){
          throw new Error("Invalid Token")
      }
      const userData = await User.findOne({_id:decode.id})
    

      if(!userData){
          throw new Error("user not found")
      }
      if(req.file&&req.file.path){

        const result = await cloudinary.uploader.upload(req.file.path) 
      
        userData.image=result.secure_url
        // userData.image=req.file.filename;
          // const url =req.file.filename;
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
   
    const jwtToken = req.cookies.jwtOfUser.UserToken;
   
    const decode=jwt.verify(jwtToken,process.env.User_Key)
   
     if(!decode.id){
         throw new Error("Invalid Token")
     }
     const bookingData=await Booking.find({userID:decode.id}).populate('hotelID').sort({createdAt:-1})
 
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
    
    const jwtToken = req.cookies.jwtOfUser.UserToken;
   
    const decode=jwt.verify(jwtToken,process.env.User_Key)
   
     if(!decode.id){
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
    const jwtToken = req.cookies.jwtOfUser.UserToken;
   
    const decode=jwt.verify(jwtToken,process.env.User_Key)
   
     if(!decode.id){
         throw new Error("Invalid Token")
     }
     const userId=decode.id
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
   
    const jwtToken = req.cookies.jwtOfUser.UserToken;
   
    const decode=jwt.verify(jwtToken,process.env.User_Key)
   
     if(!decode.id){
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
   
    if(bookingData.userID ==decode.id)
    {
      const UserData = await User.findById({_id:decode.id})
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
        otpSending,
        CancelBooking

    }