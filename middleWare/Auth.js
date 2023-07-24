const Vendor = require('../models/Vendor');
const jwt = require("jsonwebtoken");
const VendorAuth = async (req, res, next) => {
    try {
        if (!req.cookies || !req.cookies.jwt.VendorToken) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const jwtToken = req.cookies.jwt.VendorToken;
        const decodetoken = jwt.verify(jwtToken, "secretCodeforVendor");
        const vendorId = decodetoken.id;
        const vendorData = await Vendor.findById({ _id: vendorId });

        if (vendorData) {
            req.id = vendorData._id; // Set the 'id' property in the 'req' object
            next(); // Call next() with the updated 'req' object
        } else {
            return res.status(401).json({ error: "Unauthorized" });
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports={VendorAuth}