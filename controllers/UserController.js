const Vendor=require('../models/Vendor')
const User=require('../models/User');
const jwt = require("jsonwebtoken");
const Booking=require('../models/Booking');

// ...............................add user ..................

const addUser=async(req,res)=>{
    try {
     
        const{name,email,password,phone}=req.body
      const  UserData=new User({
        name,email,password,phone
        })
        await UserData.save();
        
        if(!UserData){
           return res.status(500).json({message:"unable to add user"}) 
        }
       return res.status(200).json({UserData,message:'success'})
    } catch (error) {
        console.log(error.message);
        
    }}

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
       
            if(UserData){
                
               
                UserSignup.Status = true;
                UserSignup.name = UserData.name;
         
          let UserToken = jwt.sign({ id: UserData._id }, "secretCodeforUser", {
            expiresIn: "24h",
          });
          UserSignup.token = UserToken;
          let obj = {
            UserToken,
          };
          res
            .cookie("jwt", obj, {
              httpOnly: false,
              maxAge: 6000 * 1000,
            })
            .status(200)
            .send({ UserSignup,message:'success...!' })
             }
           else{
           
            UserSignup.message = "Your Email or Password wrong";
            UserSignup.Status = false;
          res.send({ UserSignup });
           }
            
        } catch (error) {
            console.log(error.message);
            UserSignup.Status = false;
            UserSignup.message = error;
            res.send({ UserSignup });
            
        }
    }


    
const getProfile=async(req,res,next)=>{
  try {
    
    if (!req.cookies || !req.cookies.jwt.UserToken) {
      
      return res.status(401).json({ error: "Unauthorized" });
    }

    
    const jwtToken = req.cookies.jwt.UserToken;
    const decodetoken = jwt.verify(jwtToken, "secretCodeforUser");

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
    
    const jwtToken = req.cookies.jwt.UserToken;
    const decode=jwt.verify(jwtToken,"secretCodeforUser")
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
      
     const jwtToken = req.cookies.jwt.UserToken;
     const decode=jwt.verify(jwtToken,"secretCodeforUser")

      if(!decode.id){
          throw new Error("Invalid Token")
      }
      const userData = await User.findOne({_id:decode.id})
    

      if(!userData){
          throw new Error("user not found")
      }
      if(req.file&&req.file.path){
      
        userData.image=req.file.filename;
          const url =req.file.filename;
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
    const jwtToken = req.cookies.jwt.UserToken;
   
    const decode=jwt.verify(jwtToken,"secretCodeforUser")
   
     if(!decode.id){
         throw new Error("Invalid Token")
     }
     const bookingData=await Booking.find({userID:decode.id}).populate('hotelID')
    console.log(bookingData);
     if(!bookingData){
      throw new Error("no booking found")
  }
  res.status(200).send({bookingData,message:"success"})

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
        userBookings

    }