const Admin = require("../models/Admin");
const vendor = require("../models/Vendor");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Booking=require('../models/Booking');
const Hotel=require('../models/Hotel')
const moment = require('moment');
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< add admin account >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const addAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const adminData = new Admin({
      name,
      email,
      password,
    });
    await adminData.save();

    if (!adminData) {
      return res.status(500).json({ message: "unable to add admin" });
    }
    return res.status(201).json({ adminData });
  } catch (error) {
    console.log(error.message);
  }
};

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Admin Login >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const adminLogin = async (req, res) => {
  try {
    let adminSignup = {
      Status: false,
      message: null,
      token: null,
      name: null,
    };
    const { email, password } = req.body;
    const adminData = await Admin.findOne({ email: email, password: password });

    if (adminData) {
      adminSignup.Status = true;
      adminSignup.name = adminData.name;
     
      let AdminToken = jwt.sign({ id: adminData._id }, process.env.Admin_Key, {
        expiresIn: "24h",
      });
      adminSignup.token = AdminToken;
      let obj = {
        AdminToken,
      };
      
        res.status(200)
        .send({ adminSignup });
    } else {
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
};

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Vendor Requests >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const vendorRequest = async (req, res) => {
  try {
    const vendorData = await vendor.find({ proofstatus: false });

    if (vendorData) {
      return res.status(200).json({ vendorData });
    } else {
      return res.status(404).json({ message: "No vender request Found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Vendorview >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const vendorView = async (req, res) => {
  try {
    const id = req.params.id;

    const vendorData = await vendor.findById({ _id: id });

    if (vendorData) {
      return res.status(200).json({ vendorData });
    } else {
      return res.status(404).json({ message: "No vender data request Found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Vendor approval >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const vendorApprove = async (req, res) => {
  try {
    const id = req.body.vendorId;

    await vendor.findByIdAndUpdate(
      { _id: id },
      { $set: { proofstatus: true } }
    );

    const vendorData = await vendor.findById({ _id: id });

    if (vendorData) {
      return res.status(200).json({ message: "vendorData updated" });
    } else {
      return res.status(404).json({ message: "No vender data request Found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Vendor Requests >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const vendorManage = async (req, res) => {
  try {
    const vendorData = await vendor.find({ proofstatus: true });

    if (vendorData) {
      return res.status(200).json({ vendorData });
    } else {
      return res.status(404).json({ message: "No vender request Found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  User Listing >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const UserManage = async (req, res) => {
  try {
    const userData = await User.find({});

    if (userData) {
      return res.status(200).json({ userData });
    } else {
      return res.status(404).json({ message: "No User Found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  User Block >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const UserStatusChange = async (req, res) => {
  try {
    console.log('userblock');
    const id = req.query.id;
    const userStatus = await User.findOne({ _id: id });

    userStatus.status= !userStatus.status
    const userData = await userStatus.save();

    if (userData) {
      return res.status(200).json({ userData });
    } else {
      return res.status(404).json({ message: "No User Found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// .............................category............................

const Addcategory = async (req, res) => {
  try {
   

    const vendorId = req.id

    const Vendor = await vendor.findOne({ _id: vendorId });

    if (Vendor) {
      console.log(req.body, "booooo");
      const { newCategory } = req.body;

      const categoryData = new category({
        categoryname: newCategory,
      });
      await categoryData.save();

      if (!categoryData) {
        return res.status(500).json({ message: "unable to add category" });
      }
      return res.status(201).json({ categoryData });
    } else {
      return res.status(500).json({ message: "unable to add category" });
    }
  } catch (error) {
    console.log(error.message);
  }
};
// ...........................get category...........................
const getCategory = async (req, res) => {
  try {
    const categoryData = await category.find().populate();
    console.log(categoryData, "got it category");

    if (!categoryData) {
      return res.status(500).json({ message: "unable to find category" });
    }
    return res.status(201).json({ categoryData });
  } catch (error) {
    console.log(error.message);
  }
};

// ......................getSingleBookingData...............................
const BookingsDetails=async(req,res)=>{
  try {
 
    
    console.log(req.id,'req.id');
     const bookingData=await Booking.find().populate('hotelID').populate('userID')
    
     if(!bookingData){
      throw new Error("no booking found")
  }
  res.status(200).send({bookingData,message:"success"})

  } catch (error) {
    res.status(500).json({error:'Internal server error'});
  }

}

// .......................vendor status change............................
const VendorStatusChange = async (req, res) => {
  try {
    console.log('vendor', req.query.id);
    const id = req.query.id;
    const vendorStatus = await vendor.findOne({ _id: id });

    vendorStatus.status= !vendorStatus.status
    const vendorData = await vendorStatus.save();

    const hotelDate = await Hotel.find({ vendor: id });
for (data of hotelDate) {
  await Hotel.updateOne({ _id: data._id }, { adminStatus:!data.adminStatus });
}


    if (vendorData) {
      return res.status(200).json({ vendorData ,message:'status updated'});
    } else {
      return res.status(404).json({ message: "No vendor Found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};


const CancelBooking=async(req,res)=>{
  try {
    
     const id=req.query.id
   
     
     const bookingData=await Booking.findById({_id:id,BookingStatus:'Booked'}).populate('hotelID')
    
    if(!bookingData){

      res.status(404).json({message:'data not found'})
    }
     if(bookingData.paymentStatus !==true){
      res.status(404).json({message:'paymentStatus not true'})
     
  }else{
   
    if(bookingData)
    {
      const UserData = await User.findById({_id:bookingData.userID})
      UserData.wallet=UserData.wallet+bookingData.UpdatedTotal-bookingData.serviceFee
      UserData.save()
      bookingData.BookingStatus='cancelled'
      bookingData.save()
      
      res.status(200).send({bookingData,message:"success"})
    }
    else{
      res.status(404).json({message:'data missMatching'})
    }
  }


  } catch (error) {
    res.status(500).json({error:'Internal server error'});
  }

}


// ................................dash Board..........................

const Dashbord = async (req, res) => {
  try {
    
    const bookingData = await Booking.find({
      BookingStatus:"Booked" ,
      paymentStatus:true
      
      });

      const userCounts = {};
      let totalUserCount = 0;
      let totalRevenue = 0;
      let totalfee = 0;
      let totalTax = 0;
      let totalDiscount = 0;
      let totalAmount = 0;

      bookingData.forEach(booking => {
          const userId = booking.userID.toString(); 
          if (!userCounts[userId]) {
              userCounts[userId] = 1;
              totalUserCount++;
          } else {
              userCounts[userId]++;
          }
          totalRevenue += booking.UpdatedTotal
          totalAmount += booking.total
          totalDiscount += booking.discount
          totalTax += booking.tax
          totalfee += booking.serviceFee
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
        chartDatamonthly,
        totalAmount,
        totalDiscount,
        totalTax,
        totalfee
    };
   
       return res.status(200).json({ data ,message:'Booking Datas'});
    
  } catch (error) {
    console.log(error.message);
  }
};

// .................................booking data.............................

const BookingData=async(req,res)=>{
  try {
     
      const bookingData = await Booking.find({ paymentStatus: true ,BookingStatus:"Booked"}).populate('userID').populate('hotelID')

     if(!bookingData){
      throw new Error("no booking found")
  }
  res.status(200).send({bookingData,message:"success"})

  } catch (error) {
    res.status(500).json({error:'Internal server error'});
  }

}





module.exports = {
  addAdmin,
  adminLogin,
  vendorRequest,
  vendorView,
  vendorApprove,
  vendorManage,
  UserManage,
  UserStatusChange,
  BookingsDetails,
  VendorStatusChange,
  CancelBooking,
  Dashbord,
  BookingData
};
