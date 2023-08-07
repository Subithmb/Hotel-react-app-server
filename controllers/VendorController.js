const Vendor=require('../models/Vendor')
// const User=require('../model/User');
const jwt = require("jsonwebtoken");
const cloudinary = require('../middleWare/cloudinary')
const moment = require('moment');
const Booking=require('../models/Booking');
const Hotel=require('../models/Hotel')

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
      let VendorToken = jwt.sign({ id: VendorData._id }, process.env.Vendor_Key, {
        expiresIn: "24h",
      });
      vendorSignup.token = VendorToken;
      let obj = {
        VendorToken,
      };
      // res
      //   .cookie("jwtOfVendor", obj, {
      //     httpOnly: false,
      //     maxAge: 6000 * 1000,
      //     secure:false
      //   })
        res.status(200)
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

    // const jwtToken = req.cookies.jwtOfVendor;
    // const decode=jwt.verify(jwtToken,process.env.Vendor_Key)

     if(!req.id){
         throw new Error("Invalid Token")
     }else{
     const vendorData = await Vendor.findOne({_id:req.id})
   
     if(!vendorData){
         throw new Error("vendor not found")
     }
   
      try{
      const vendor = await Vendor.findOne({ _id:req.id });
      
       
      if (!vendor) {
        return res.status(404).json({ error: "vendor not found" });
      } 
        return res.status(200).json({ vendor });
      } catch (error) {
        return res.status(500).json({ error: "Database error" });
      }
    }
   
  } catch (error) {
    return res.status(403).json({ error: "Token verification failed" });
  }
}

// ..................edit profile  of vendor  ...........................

const editVendorProfile= async(req,res)=>{
  try {
    // const jwtToken = req.cookies.jwtOfVendor;
    // const decode=jwt.verify(jwtToken,process.env.Vendor_Key)
   const id=req.id

      if(!id){
          throw new Error("Invalid Token")
      }
      const{name,phone,email,brand}=req.body.VendorDatas
      console.log(name);
      await Vendor.findByIdAndUpdate({_id:req.id},{$set:{name:name,phone:phone,email:email,brand:brand}})

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
     
   

      if(!req.id){
          throw new Error("Invalid Token")
      }
      const vendorData = await Vendor.findOne({_id:req.id})
    console.log(vendorData);

      if(!vendorData){
          throw new Error("vendor not found")
      }
      console.log(req.file,'hfhfh');
      if(req.file&&req.file.path){
        const result = await cloudinary.uploader.upload(req.file.path)
        // console.log('ready ayiiiiiiii',req.file.path);
        vendorData.image=result.secure_url;
          const url =result.secure_url;
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
   
      
    //  const jwtToken = req.cookies.jwtOfVendor;
    //  const decode=jwt.verify(jwtToken,process.env.Vendor_Key)

      if(!req.id){
          throw new Error("Invalid Token")
      }
      const vendorData = await Vendor.findOne({_id:req.id})
     // console.log(vendorData,'vennnnnnnnnnnnnnnnnnndor');

      if(!vendorData){
          throw new Error("vendor not found")
      }
      
      if(req.file&&req.file.path){
        const result = await cloudinary.uploader.upload(req.file.path)
        vendorData.proof=result.secure_url
          const url =result.secure_url;
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


// .................................booking data.............................

const BookingData=async(req,res)=>{
  try {
    
    // const jwtToken = req.cookies.jwtOfVendor;
    // const decode=jwt.verify(jwtToken,process.env.Vendor_Key)
    
     if(!req.id){
           throw new Error("Invalid Token")
       }

       const partnerId=req.id
      
      const Data = await Booking.find({ paymentStatus: true,BookingStatus:"Booked" }).populate('userID').populate('hotelID')

      const bookingData=await Data.filter((value)=>{
   
   return value.hotelID.vendor.toHexString()===partnerId
 
 })
 
     if(!bookingData){
      throw new Error("no booking found")
  }
  res.status(200).send({bookingData,message:"success"})

  } catch (error) {
    res.status(500).json({error:'Internal server error'});
  }

}



// ................................dash Board..........................

const Dashbord = async (req, res) => {
  try {

    // const jwtToken = req.cookies.jwtOfVendor;
    // const decode=jwt.verify(jwtToken,process.env.Vendor_Key)
    
     if(!req.id){
           throw new Error("Invalid Token")
       }
       const partnerId=req.id
       const Data = await Booking.find({ paymentStatus: true, BookingStatus:"Booked" }).populate('userID').populate('hotelID')
      const bookingData=await Data.filter((value)=>{
   return value.hotelID.vendor.toHexString()===partnerId
 
 })

      const userCounts = {};
      let totalUserCount = 0;
      let totalRevenue = 0;
      let totalTax = 0;
      let totalVendorRevenue = 0;

      bookingData.forEach(booking => {
          const userId = booking.userID.toString(); 
          if (!userCounts[userId]) {
              userCounts[userId] = 1;
              totalUserCount++;
          } else {
              userCounts[userId]++;
          }
          totalRevenue += booking.UpdatedTotal
          totalVendorRevenue+=booking.total
          totalTax+=booking.tax
      });

     
    const dayOfWeekCounts = bookingData.reduce((counts, booking) => {
      const createdAt = moment(booking.createdAt);
      const dayOfWeek = createdAt.day();
    
      if (!counts[dayOfWeek]) {
        counts[dayOfWeek] = 0;
      }
    
      counts[dayOfWeek]++;
    
      return counts;
    }, {});
    
    for (let i = 0; i < 7; i++) {
      if (!dayOfWeekCounts.hasOwnProperty(i)) {
        dayOfWeekCounts[i] = 0;
      }
    }
    
    const chartData = Object.values(dayOfWeekCounts); 
  const monthCounts = moment.monthsShort().reduce((counts, monthName) => {
    counts[monthName] = 0;
    return counts;
  }, {});
  bookingData.forEach(booking => {
    const createdAt = moment(booking.createdAt);
    const monthName = createdAt.format('MMM');
    monthCounts[monthName]++;
  });

  const chartDatamonthly = Object.values(monthCounts)
     
      const data = {
        totalBookings: bookingData.length,
        totalUserCount,
        totalRevenue,
        chartData,
        chartDatamonthly
    };
  
       return res.status(200).json({ data ,message:'Booking Datas'});
    
  } catch (error) {
    console.log(error.message);
  }
};



    module.exports={
        addVendor,
        VendorLogin,
        getProfile,
        editVendorProfile,
        editProfile,
        ProofData,
        BookingData,
        Dashbord

    }