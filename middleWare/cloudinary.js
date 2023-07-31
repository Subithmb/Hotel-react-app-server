require("dotenv").config()
const cloudinary = require('cloudinary').v2;

 cloudinary.config({
  cloud_name: process.env.your_cloud_name,
  api_key: process.env.your_api_key,
  api_secret: process.env.your_api_secret
});

module.exports = cloudinary