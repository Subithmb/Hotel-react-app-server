const Vendor=require('../models/Vendor')
// const User=require('../model/User');
const jwt = require("jsonwebtoken");

const addVendor=async(req,res)=>{
    try {
       
        const{name,email,password,brand,phone}=req.body
      const  VendorData=new Vendor({
        name,email,password,brand,phone
        })
        await VendorData.save();
        
        if(!VendorData){
           return res.status(500).json({message:"unable to add Vendor"}) 
        }
       return res.status(201).json({VendorData})
    } catch (error) {
        console.log(error.message);
        
    }}

     
const VendorLogin=async(req,res)=>{
   
    try {
        let vendorSignup = {
            Status: false,
            message: null,
            token: null,
            name: null,
          };
         
        const {email,password}=req.body
       const VendorData=await Vendor.findOne({email:email,password:password});
   
        if(VendorData){
            
           
            vendorSignup.Status = true;
            vendorSignup.name = VendorData.name;
      // const Adminname = adminData[0].name
      let VendorToken = jwt.sign({ id: VendorData._id }, "secretCodeforVendor", {
        expiresIn: "24h",
      });
      vendorSignup.token = VendorToken;
      let obj = {
        VendorToken,
      };
      res
        .cookie("jwt", obj, {
          httpOnly: false,
          maxAge: 6000 * 1000,
        })
        .status(200)
        .send({ vendorSignup,message:'success...' })
         }
       else{
       
        vendorSignup.message = "Your Email or Password wrong";
        vendorSignup.Status = false;
      res.send({ vendorSignup });
       }
        
    } catch (error) {
        console.log(error.message);
        vendorSignup.Status = false;
        vendorSignup.message = error;
        res.send({ vendorSignup });
        
    }
}

const getProfile=async(req,res,next)=>{
  try {
    
    if (!req.cookies || !req.cookies.jwt.VendorToken) {
      
      return res.status(401).json({ error: "Unauthorized" });
    }

    
    const jwtToken = req.cookies.jwt.VendorToken;
    const decodetoken = jwt.verify(jwtToken, "secretCodeforVendor");

    // console.log('jwt',decodetoken);

      const vendorId = decodetoken.id;
      try{
      const vendor = await Vendor.findOne({ _id: vendorId });
      
       
      if (!vendor) {
        return res.status(404).json({ error: "vendor not found" });
      } 
        return res.status(200).json({ vendor });
      } catch (error) {
        return res.status(500).json({ error: "Database error" });
      }
   
  } catch (error) {
    return res.status(403).json({ error: "Token verification failed" });
  }
}

// ..................edit profile  of vendor  ...........................

const editVendorProfile= async(req,res)=>{
  try {
    const jwtToken = req.cookies.jwt.VendorToken;
    const decode=jwt.verify(jwtToken,"secretCodeforVendor")
   const id=decode.id

      if(!decode.id){
          throw new Error("Invalid Token")
      }
      const{name,phone,email,brand}=req.body.VendorDatas
      console.log(name);
      await Vendor.findByIdAndUpdate({_id:id},{$set:{name:name,phone:phone,email:email,brand:brand}})

      const vendorData = await Vendor.findById({_id:id})
      console.log(vendorData,'decodeveendor');

      if(!vendorData){
          throw new Error("vendor not found")
      }
    
          res.status(200).send({vendorData,message:"success"})

      
  } catch (error) {
      res.status(500).json({error:'Internal server error'});
  }
}

// .................................

const editProfile= async(req,res)=>{
  try {
      // console.log(req.cookies.jwt.VendorToken);
     const jwtToken = req.cookies.jwt.VendorToken;
     const decode=jwt.verify(jwtToken,"secretCodeforVendor")

      if(!decode.id){
          throw new Error("Invalid Token")
      }
      const vendorData = await Vendor.findOne({_id:decode.id})
    

      if(!vendorData){
          throw new Error("vendor not found")
      }
      if(req.file&&req.file.path){
        // console.log('ready ayiiiiiiii',req.file.path);
        vendorData.image=req.file.filename;
          const url =req.file.filename;
          await vendorData.save()
      
          res.status(200).send({success:true,url,message:"success"})
      }else{
          throw new Error("No image is there")
      }
      
  } catch (error) {
      res.status(500).json({error:'Internal server error'});
  }
}

const ProofData= async(req,res)=>{
  try {
   
      
     const jwtToken = req.cookies.jwt.VendorToken;
     const decode=jwt.verify(jwtToken,"secretCodeforVendor")

      if(!decode.id){
          throw new Error("Invalid Token")
      }
      const vendorData = await Vendor.findOne({_id:decode.id})
     // console.log(vendorData,'vennnnnnnnnnnnnnnnnnndor');

      if(!vendorData){
          throw new Error("vendor not found")
      }
      
      if(req.file&&req.file.path){
        vendorData.proof=req.file.filename;
          const url =req.file.filename;
          await vendorData.save()
          console.log(url,"success")
          res.status(200).send({success:true,url,message:"proof added"})
      }else{
          throw new Error("No proof is there")
      }
      
  } catch (error) {
      res.status(500).json({error:'Internal server error'});
  }
}


// const getProfileimage=async(req,res,next)=>{
//   try {console.log('dpppppppppppppppppppppp',req.cookies.jwt.VendorToken,'mmmmmmmmmmmmmmm');
//     if (!req.cookies || !req.cookies.jwt.VendorToken) {
      
//       return res.status(401).json({ error: "Unauthorized" });
//     }

    
//     const jwtToken = req.cookies.jwt.VendorToken;
//     const decodetoken = jwt.verify(jwtToken, "secretCodeforVendor");

//     console.log('jwt',decodetoken);

//       const vendorId = decodetoken.id;
//       try{
//         const base64=req.body.image
//         console.log(req.body.image,'looooog');
      
//        await Vendor.findOneAndUpdate({ _id: vendorId },{$set:{image:base64}})
//        const vendor =await Vendor.findOne({ _id:vendorId })
        
//       console.log(vendor.image,'uuuuserrrrrrrrrrrrimgggggggggggggggggggg');
       
//       if (!vendor) {
//         return res.status(404).json({ error: "vendor not found" });
//       } 
//         return res.status(200).json({ vendor });
//       } catch (error) {
//         return res.status(500).json({ error: "Database error" });
//       }
   
//   } catch (error) {
//     return res.status(403).json({ error: "Token verification failed" });
//   }
// }

// const getProfileimages=async(req,res,next)=>{
//   try {console.log('dpppppppppppppppppppppp',req.cookies.jwt.VendorToken,'mmmmmmmmmmmmmmm');
//     if (!req.cookies || !req.cookies.jwt.VendorToken) {
      
//       return res.status(401).json({ error: "Unauthorized" });
//     }

    
//     const jwtToken = req.cookies.jwt.VendorToken;
//     const decodetoken = jwt.verify(jwtToken, "secretCodeforVendor");

//     console.log('jwt',decodetoken);

//       const vendorId = decodetoken.id;
//       try{
//         const base64=req.body.image
//         console.log(req.body.image,'looooog');
      
//        await Vendor.findOneAndUpdate({ _id: vendorId },{$set:{image:base64}})
//       //  let vendor =await Vendor.findOne({ _id:vendorId })
//         vendor=vendor.image
//       console.log(vendor,'uuuuserrrrrrrrrrrrimgggggggggggggggggggg');
       
//       if (!vendor) {
//         return res.status(404).json({ error: "vendor not found" });
//       } 
//         return res.status(200).json({ vendor });
//       } catch (error) {
//         return res.status(500).json({ error: "Database error" });
//       }
   
//   } catch (error) {
//     return res.status(403).json({ error: "Token verification failed" });
//   }
// }


    module.exports={
        addVendor,
        VendorLogin,
        getProfile,
        editVendorProfile,
        editProfile,
        // getProfileimage,
        // getProfileimages,
        ProofData

    }