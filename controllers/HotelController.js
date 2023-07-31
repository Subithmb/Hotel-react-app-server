const Admin=require('../models/Admin')
const vendor=require('../models/Vendor')
const Hotel=require('../models/Hotel');
const category=require('../models/category');
const jwt = require("jsonwebtoken");
const cloudinary = require('../middleWare/cloudinary')
// .............................category............................
const Addcategory=async(req,res)=>{
    try {
        if (!req.cookies || !req.cookies.jwt.AdminToken) {
      
            return res.status(401).json({ error: "Unauthorized" });
          }
          const jwtToken = req.cookies.jwt.AdminToken;
          const decodetoken = jwt.verify(jwtToken, "Secretcode");
      
            const AdminId = decodetoken.id;
            
            const AdminData = await Admin.findOne({ _id: AdminId });
             
            if (AdminData) {
               
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
            
            const Vendor = await vendor.findOne({ _id: vendorId,proofstatus:true});
                 
            if (Vendor) {
                const Images=[]
              
                // const licenseFile =  req.files.license[0].path;
                // Upload the license file to Cloudinary
                // const licenseResult = await cloudinary.uploader.upload(licenseFile.path);
                const licenseResult = await cloudinary.uploader.upload(req.files.license[0].path) 
                if(!licenseResult){
                    return res.status(500).json({message:"unable to add Hotel proof is not added"}) 
                }
                //  const imageFilenames = req.files?.images?.map((file) => file?.filename);
                const imageFilenames = req.files?.images
                if(!imageFilenames){
                    return res.status(500).json({message:"unable to add Hotel image is not added"}) 
                }
                for (const image of imageFilenames) {
                    const result = await cloudinary.uploader.upload(image.path);
                    if (result && result.secure_url) {
                        
                        Images.push(result.secure_url);
                    } }
                  
                    const{Name,categoryname,Description,phone,Town,Pin,noofrooms,Rate,AC,FOOD,TV,PETS,PARTYHALL,FISHING,GAMES,WIFI,gust,district}=req.body
            const  HotelData=new Hotel({
                Name,categoryname,Description,phone,Town,Pin,noofrooms,Rate,Images,gust,district,
                Facilities: [{AC,FOOD,TV,PETS,PARTYHALL,FISHING,GAMES,WIFI }],
                vendor:vendorId,proof:licenseResult.secure_url
                })
                const NewHotelData= await HotelData.save() 
                if(!NewHotelData){
                   return res.status(500).json({message:"unable to add Hotel"}) 
                }
               return res.status(201).json({NewHotelData,message:"Hotel Added"})
             }else{
                return res.status(500).json({message:"unable to add Hotel vendor is not verified"})
             }   
    } catch (error) {
        console.log(error.message);
        
    }
}

// ....................................get hoteldata......................................

const hotelData=async(req,res)=>{
    try {
        if (!req.cookies || !req.cookies.jwt.VendorToken) {
      
            return res.status(401).json({ error: "Unauthorized" });
          }
      
          const jwtToken = req.cookies.jwt.VendorToken;
          const decodetoken = jwt.verify(jwtToken, "secretCodeforVendor");
      
            const vendorId = decodetoken.id;
        
            if (vendorId) {
        const hotels=await Hotel.find({vendor:vendorId})
       
       if(hotels){
           return res.status(201).json({hotels})
        }else{
            return res.status(500).json({message:"unable to get Hotel details"}) 
        }
    }else{
        return res.status(500).json({message:"unable to get Hotel details of this vendor"})
    }

    } catch (error) {
        console.log(error.message);
        
    }
}
// ....................................get hoteldata request to admin......................................

const hotelDatarequestAdmin=async(req,res)=>{
    try {    
        const hotels=await Hotel.find({proofstatus:false})
       if(hotels){
           return res.status(201).json({hotels})
        }else{
            return res.status(500).json({message:"unable to get Hotel details"}) 
        }
    } catch (error) {
        console.log(error.message);    
    }
}
// ....................................get hoteldata  to admin......................................

const hotelDataAdmin=async(req,res)=>{
    try {
        
        const hotels=await Hotel.find({proofstatus:true})
       if(hotels){
           return res.status(201).json({hotels})
        }else{
            return res.status(500).json({message:"unable to get Hotel details"}) 
        }
    } catch (error) {
        console.log(error.message);
        
    }
}
// ....................................get hotelStatus change  by admin......................................

const hotelStatusChange=async(req,res)=>{
    try {
        const id = req.query.id;
        const hotelStatus=await Hotel.findOne({_id:id})
        hotelStatus.status=!hotelStatus.status
        const hotels = await hotelStatus.save();

       if(hotels){
           return res.status(201).json({hotels})
        }else{
            return res.status(500).json({message:"unable to get Hotel details"}) 
        }
    } catch (error) {
        console.log(error.message);
        
    }
}
// ....................................get hoteldata  to user......................................

const hotelDataUser=async(req,res)=>{
    try {
        if (!req.cookies || !req.cookies.jwt.UserToken) {
      
            return res.status(401).json({ error: "Unauthorized" });
          }
      
          
          const jwtToken = req.cookies.jwt.UserToken;
          const decodetoken = jwt.verify(jwtToken, "secretCodeforUser");
      
          // console.log('jwt',decodetoken);
      
            const userId = decodetoken.id;
       const hotels=await Hotel.find({proofstatus:true,status:false,adminStatus:false}).populate('review')
       if(hotels){
       const categoryData=await category.find({})
           return res.status(201).json({hotels,categoryData})
        }else{
            return res.status(500).json({message:"unable to get Hotel details"}) 
        }
    } catch (error) {
        console.log(error.message);     
    }
}
// ....................................get hoteldata  to user single view......................................

const singleHotelData=async(req,res)=>{
    try {
        if (!req.cookies || !req.cookies.jwt.UserToken) {
      
            return res.status(401).json({ error: "Unauthorized" });
          }
      
          
          const jwtToken = req.cookies.jwt.UserToken;
          const decodetoken = jwt.verify(jwtToken, "secretCodeforUser");
      
          // console.log('jwt',decodetoken);
      
            const userId = decodetoken.id;
        const id =req.params.id
       const hotels=await Hotel.find({_id:id,proofstatus:true,status:false}).populate('review.userId')
       if(hotels){
    //    const categoryData=await category.find({})
           return res.status(201).json({hotels})
        }else{
            return res.status(500).json({message:"unable to get Hotel details"}) 
        }
    } catch (error) {
        console.log(error.message);     
    }
}
// ....................................get hoteldata  to admin......................................

const updateproofstatus=async(req,res)=>{
    try {
        const id=req.body.id
        const hotels=await Hotel.findByIdAndUpdate({_id:id},{$set:{proofstatus:true}})
       if(hotels){
           return res.status(201).json({hotels})
        }else{
            return res.status(500).json({message:"unable to get Hotel details"}) 
        }
    } catch (error) {
        console.log(error.message);    
    }
}


// ...........................get booking for vendor..............................




module.exports={
    AddHotel,
    hotelData,
    Addcategory,
    getCategory,
    hotelDatarequestAdmin,
    hotelDataAdmin,
    updateproofstatus,
    hotelDataUser,
    singleHotelData,
    hotelStatusChange

}