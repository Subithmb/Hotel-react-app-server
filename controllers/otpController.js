// // otp.js
// const nodemailer = require('nodemailer');

// // Create a Map to store OTPs and associated email addresses
// const otpStorage = new Map();

// // Generate a random OTP
// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000);
// }

// // Send OTP via email
// function sendOTP( callback) {
//     console.log('sdfsfsfsfsfsfsfsssssssssssssssssssssssssssss  ');
//     const email=req.body
//     console.log('sddddddddddddddddddd');
//   const otp = generateOTP();

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.user, // Use your email credentials stored in environment variables
//       pass: process.env.pass,
//     },
//   });

//   const mailOptions = {
//     from: 'ikeaecom2023@gmail.com',
//     to: email,
//     subject: 'Your OTP for Login',
//     text: `Your OTP is: ${otp}`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error);
//       callback(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//       // Store the OTP along with the email in the Map
//       otpStorage.set(email, otp);
//       callback(null, otp);
//     }
//   });
// }

// // Validate the entered OTP
// function validateOTP(email, enteredOTP) {
//   const storedOTP = otpStorage.get(email);

//   if (!storedOTP) {
//     // OTP not found for the provided email
//     return false;
//   }

//   if (storedOTP === enteredOTP) {
//     // Valid OTP
//     return true;
//   }

//   // Invalid OTP
//   return false;
// }

// module.exports = {
//   generateOTP,
//   sendOTP,
//   validateOTP,
// };


const nodemailer = require("nodemailer");
const User=require("../models/User")
const Partner=require("../models/Vendor")

const OTP_EXPIRATION = 3 * 60 * 1000; // OTP expiration time (5 minutes)

// Function to generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hash map to store OTPs and their expiration times
const otpMap = new Map();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

// Function to send OTP via email
async function sendOTP(req, res,next) {
  const { email } = req.body;
  console.log(email,"qqqqqqqqqqqqq");
  const otp = generateOTP();

  const mailOptions = {
    from: "ikeaecom2023@gmail.com",
    to: email,
    subject: "OTP Verification",
    html:`<p>Your Hotel OTP is  <span  style="font-size:24px;font-weight:bold;">  ${otp} </span> .It will expire in 3 minutes, Do not share with others</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({status:false, message: "Failed to send OTP" });
    } else {
      otpMap.set(email, {
        otp: otp,
        expirationTime: Date.now() + OTP_EXPIRATION,
      });
      res.status(200).json({status:true, message: "OTP sent successfully" });
    }
  });
}

// Function to verify OTP
function verifyOTP(req, res) {
  const { email, otp } = req.body;
  console.log(email,otp,"0000000000");
  const storedOTP = otpMap.get(email);

  if (storedOTP && storedOTP.otp === otp && storedOTP.expirationTime >= Date.now()) {
    // If OTP is valid and not expired
    otpMap.delete(email);
    // Save the user details to the database here
    res.status(200).json({status:true, message: "OTP verified successfully" });
  } else {
    res.status(400).json({status:false, message: "Invalid OTP or OTP expired" });
  }
}

module.exports = { sendOTP, verifyOTP };