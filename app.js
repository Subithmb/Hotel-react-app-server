
const cookieParser =require("cookie-parser")
const express = require('express');
const app=express();
const mongoose = require('mongoose');
const cors = require('cors');
const path=require('path')
require("dotenv").config()
 const userRouter = require("./routes/UserRoute");
const adminRouter = require("./routes/AdminRoute");
const vendorRouter = require("./routes/VendorRoute");
const nodemailer = require('nodemailer')

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')))
app.options('*', cors());

 app.use("/", userRouter);
app.use("/admin",adminRouter);
app.use("/vendor",vendorRouter);

// mongoose.connect('mongodb+srv://admin:CfVhU9ypzIwU0ZZ2@cluster0.uersqux.mongodb.net')
// mongoose.connect('mongodb+srv://admin:t8HhOrnPvpfO1Yp4@cluster0.uersqux.mongodb.net/usermanage?retryWrites=true&w=majority')

mongoose.connect(process.env.db_Connection).then(()=>{
    app.listen(5000,()=>{console.log('server running.... on port 5000')
})
})







const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.your_cloud_name,
  api_key: process.env.your_api_key,
  api_secret: process.env.your_api_secret
});


