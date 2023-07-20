const Admin=require('../models/Admin')
const vendor=require('../models/Vendor')
// const User=require('../model/User');
const jwt = require("jsonwebtoken");

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< add admin account >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const addAdmin=async(req,res)=>{
    try {
       
        const{name,email,password}=req.body
      const  adminData=new Admin({
        name,email,password
        })
        await adminData.save();
        
        if(!adminData){
           return res.status(500).json({message:"unable to add admin"}) 
        }
       return res.status(201).json({adminData})
    } catch (error) {
        console.log(error.message);
        
    }}

 
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Admin Login >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const adminLogin=async(req,res)=>{
   
    try {
        let adminSignup = {
            Status: false,
            message: null,
            token: null,
            name: null,
          };
        const {email,password}=req.body
       const adminData=await Admin.findOne({email:email,password:password});
    
        if(adminData){
            
           
      adminSignup.Status = true;
      adminSignup.name = adminData.name;
      // const Adminname = adminData[0].name
      let AdminToken = jwt.sign({ id: adminData._id }, "Secretcode", {
        expiresIn: "24h",
      });
      adminSignup.token = AdminToken;
      let obj = {
        AdminToken,
      };
      res
        .cookie("jwt", obj, {
          httpOnly: false,
          maxAge: 6000 * 1000,
        })
        .status(200)
        .send({ adminSignup })
         }
       else{
       
        adminSignup.message = "Your Email or Password wrong";
      adminSignup.Status = false;
      res.send({ adminSignup });
       }
        
    } catch (error) {
        console.log(error.message);
        adminSignup.Status = false;
        adminSignup.message = error;
        res.send({ adminSignup });
        
    }
}


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Vendor Requests >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const vendorRequest=async(req,res)=>{
  try {
    const vendorData= await vendor.find({proofstatus:false})
  
    if(vendorData){
      return res.status(200).json({vendorData})
    }else{
      return res.status(404).json({message:"No vender request Found"})
    }
    
  } catch (error) {
    console.log(error.message);
    
  }

}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Vendorview >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const vendorView=async(req,res)=>{
  try {
    const id=req.params.id

    const vendorData= await vendor.findById({_id:id})

    if(vendorData){
      return res.status(200).json({vendorData})
    }else{
      return res.status(404).json({message:"No vender data request Found"})
    }
    
  } catch (error) {
    console.log(error.message);
    
  }

}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Vendor approval >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const vendorApprove=async(req,res)=>{
  try {
    const id=req.body.vendorId

   await vendor.findByIdAndUpdate({_id:id},{$set:{proofstatus:true}})

      const vendorData= await vendor.findById({_id:id})
   
    if(vendorData){
      return res.status(200).json({message:"vendorData updated"})
    }else{
      return res.status(404).json({message:"No vender data request Found"})
    }
    
  } catch (error) {
    console.log(error.message);
    
  }

}


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Vendor Requests >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const vendorManage=async(req,res)=>{
  try {
    const vendorData= await vendor.find({proofstatus:true})
    
    if(vendorData){
      return res.status(200).json({vendorData})
    }else{
      return res.status(404).json({message:"No vender request Found"})
    }
    
  } catch (error) {
    console.log(error.message);
    
  }

}


// .............................category............................
const Addcategory=async(req,res)=>{
    try {
        if (!req.cookies || !req.cookies.jwt.VendorToken) {
      
            return res.status(401).json({ error: "Unauthorized" });
          }
          const jwtToken = req.cookies.jwt.VendorToken;
          const decodetoken = jwt.verify(jwtToken, "secretCodeforVendor");
      
            const vendorId = decodetoken.id;
            
            const Vendor = await vendor.findOne({ _id: vendorId });
            
             
            if (Vendor) {
                console.log(req.body,'booooo');
                const{newCategory}=req.body
               
                 
                
                 const  categoryData=new category({
                    categoryname:newCategory
                     })
                     await categoryData.save();
                     
                     if(!categoryData){
                        return res.status(500).json({message:"unable to add category"}) 
                     }
                    return res.status(201).json({categoryData})
                  }else{
                     return res.status(500).json({message:"unable to add category"})
                  }
        
    } catch (error) {
        console.log(error.message);
    }
}
// ...........................get category...........................
const getCategory=async(req,res)=>{
    try {
                 const  categoryData=await category.find().populate()
                   console.log(categoryData,'got it category');
                     
                     if(!categoryData){
                        return res.status(500).json({message:"unable to find category"}) 
                     }
                    return res.status(201).json({categoryData})

            } catch (error) {
                console.log(error.message);
                
            }
        }

// ...................................add hotel.....................
const AddHotel=async(req,res)=>{
    try {
        if (!req.cookies || !req.cookies.jwt.VendorToken) {
      
            return res.status(401).json({ error: "Unauthorized" });
          }
      
          
          const jwtToken = req.cookies.jwt.VendorToken;
          const decodetoken = jwt.verify(jwtToken, "secretCodeforVendor");
      
            const vendorId = decodetoken.id;
            
            const vendor = await Vendor.findOne({ _id: vendorId });
            
             
            if (vendor) {
           
           
            const{services,district,price,maxGust,phone,discription,brand,place,details,Hotelname}=req.body
           const image=req.file.filename
            
           
            const  HotelData=new Hotel({
                services,district,price,maxGust,phone,discription,brand,place,details,Hotelname,image
                })
                await HotelData.save();
                
                if(!HotelData){
                   return res.status(500).json({message:"unable to add Hotel"}) 
                }
               return res.status(201).json({HotelData})
             }else{
                return res.status(500).json({message:"unable to add Hotel"})
             }
            
        
    } catch (error) {
        console.log(error.message);
        
    }
}




    module.exports={
        addAdmin,
        adminLogin,
        vendorRequest,
        vendorView,
        vendorApprove,
        vendorManage

    }