const Admin = require("../models/Admin");
const vendor = require("../models/Vendor");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Booking=require('../models/Booking');
const Hotel=require('../models/Hotel')
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
    if (!req.cookies || !req.cookies.jwt.VendorToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const jwtToken = req.cookies.jwt.VendorToken;
    const decodetoken = jwt.verify(jwtToken, "secretCodeforVendor");

    const vendorId = decodetoken.id;

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

// ...................................add hotel.....................
// const AddHotel = async (req, res) => {
//   try {
//     if (!req.cookies || !req.cookies.jwt.VendorToken) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     const jwtToken = req.cookies.jwt.VendorToken;
//     const decodetoken = jwt.verify(jwtToken, "secretCodeforVendor");

//     const vendorId = decodetoken.id;

//     const vendor = await Vendor.findOne({ _id: vendorId });

//     if (vendor) {
//       const {
//         services,
//         district,
//         price,
//         maxGust,
//         phone,
//         discription,
//         brand,
//         place,
//         details,
//         Hotelname,
//       } = req.body;
//       const image = req.file.filename;

//       const HotelData = new Hotel({
//         services,
//         district,
//         price,
//         maxGust,
//         phone,
//         discription,
//         brand,
//         place,
//         details,
//         Hotelname,
//         image,
//       });
//       await HotelData.save();

//       if (!HotelData) {
//         return res.status(500).json({ message: "unable to add Hotel" });
//       }
//       return res.status(201).json({ HotelData });
//     } else {
//       return res.status(500).json({ message: "unable to add Hotel" });
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };
// ......................getSingleBookingData...............................
const BookingsDetails=async(req,res)=>{
  try {
   
    const jwtToken = req.cookies.jwt.AdminToken;
   
    const decode=jwt.verify(jwtToken,"Secretcode")
   
     if(!decode.id){
         throw new Error("Invalid Token")
     }
    
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
    // const hotelDate = await Hotel.find({vendor:id})
    // for(data of hotelDate){
    //   await Hotel.updateOne({adminStatus:!data.adminStatus})
    // }

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
  VendorStatusChange
};
