const Vendor = require('../models/Vendor');
const Admin = require('../models/Admin');
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const VendorAuth = async (req, res, next) => {
    try {
        console.log('request of vendor');
        const Header=req.headers.authorization
        const jwtToken=Header.replace('Bearer','')
        console.log(Header,'header');
       
        const decodetoken = jwt.verify(jwtToken, process.env.Vendor_Key);
        const vendorId = decodetoken.id;
        const vendorData = await Vendor.findById({ _id: vendorId });

        if (vendorData) {
            console.log('done');
            req.id = vendorData._id; 
            next(); 
        } else {
            return res.status(401).json({ error: "Unauthorized" });
        }
    } catch (error) {
        console.log(error);
    }
}


const AdminAuth = async (req, res, next) => {
    try {
        console.log('request by Admin');
        const Header=req.headers.authorization
        const jwtToken=Header.replace('Bearer','')

        const decodetoken = jwt.verify(jwtToken, process.env.Admin_Key);
        const vendorId = decodetoken.id;
        const AdminData = await Admin.findById({ _id: vendorId });

        if (AdminData) {
            console.log('done');
            req.id = AdminData._id; 
            next(); 
        } else {
            return res.status(401).json({ error: "Unauthorized " });
        }
    } catch (error) {
        console.log(error);
    }
}




const UserAuth = async (req, res, next) => {
    try {
        console.log('request by User');
        const Header=req.headers.authorization
        const jwtToken=Header.replace('Bearer','')
        if(!jwtToken){
            return res.status(401).json({ error: "Unauthorized" });
        }

        const decodetoken = jwt.verify(jwtToken, process.env.User_Key);
        const UserId = decodetoken.id;
        // const UserData = await User.findOne({ _id: UserId,status:false });
        const UserData = await User.findById({ _id: UserId});
        // console.log(UserData._id,'userID');

        if (UserData) {
            console.log('done');
            req.id = UserData._id; 
            console.log(req.id);
            next(); 
        } else {
            return res.status(401).json({ error: "Unauthorized" });
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports={VendorAuth, AdminAuth,UserAuth }