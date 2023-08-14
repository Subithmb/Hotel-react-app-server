

const nodemailer = require("nodemailer");
const User=require("../models/User")
const Partner=require("../models/Vendor")

const OTP_EXPIRATION = 3 * 60 * 1000; 

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
const otpMap = new Map();
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


// ...........................send otp to user ........................................

async function sendOTP(req, res,next) {
  const { email } = req.body;
  const UserExist=await User.findOne({email:email})
  console.log(UserExist,'userexist');
  if(UserExist){
    res.status(400).json({status:false, message: "user already exist" })
  }
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
      console.log(otp,'otp');
      res.status(200).json({status:true, message: "OTP sent successfully" });
    }
  });
}

// ..............................verify otp...................................

function verifyOTP(req, res) {
  console.log('came');
  const { email, otp } = req.body;
  console.log(email,otp,"req.body");
  const storedOTP = otpMap.get(email);
  if(!storedOTP){
    res.status(400).json({status:false, message:"Invalid OTP or OTP expired"})
  }

  if (storedOTP.otp ==otp) {
   
    otpMap.delete(email);
   
    res.status(200).json({status:true, message: "OTP verified successfully" });
  } else {
    res.status(400).json({status:false, message: "Invalid OTP or OTP expired" });
  }
}

module.exports = { sendOTP, verifyOTP };