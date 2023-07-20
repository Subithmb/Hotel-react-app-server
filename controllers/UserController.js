const Vendor=require('../models/Vendor')
const User=require('../models/User');
const jwt = require("jsonwebtoken");


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
       return res.status(201).json({UserData})
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


    module.exports={
        addUser,
        UserLogin
    }