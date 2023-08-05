const Vendor = require('../models/Vendor');
const Admin = require('../models/Admin');
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const VendorAuth = async (req, res, next) => {
    try {
        console.log('request of vendor');
        console.log(req.cookies.jwtOfVendor.VendorToken);
        if (!req.cookies || !req.cookies.jwtOfVendor.VendorToken) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const jwtToken = req.cookies.jwtOfVendor.VendorToken;
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

console.log(req.cookies.jwtOfAdmin.AdminToken);
        if (!req.cookies || !req.cookies.jwtOfAdmin.AdminToken) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const jwtToken = req.cookies.jwtOfAdmin.AdminToken;
        const decodetoken = jwt.verify(jwtToken, process.env.Admin_Key);
        const vendorId = decodetoken.id;
        const AdminData = await Admin.findById({ _id: vendorId });

        if (AdminData) {
            console.log('done');
            req.id = AdminData._id; 
            next(); 
        } else {
            return res.status(401).json({ error: "Unauthorized" });
        }
    } catch (error) {
        console.log(error);
    }
}




const UserAuth = async (req, res, next) => {
    try {
        console.log('request by User');
        console.log(req.cookies.jwtOfUser.UserToken);

        if (!req.cookies || !req.cookies.jwtOfUser.UserToken) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const jwtToken =req.cookies.jwtOfUser.UserToken;
        const decodetoken = jwt.verify(jwtToken, process.env.User_Key);
        const UserId = decodetoken.id;
        const UserData = await User.findById({ _id: UserId });

        if (UserData) {
            console.log('done');
            req.id = UserData._id; 
            next(); 
        } else {
            return res.status(401).json({ error: "Unauthorized" });
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports={VendorAuth, AdminAuth,UserAuth }