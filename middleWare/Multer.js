const multer = require("multer")
const path = require('path')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,"../public/Images"),function(error,success){
            if(error){
                console.log(error);
            }
        })
    },
    filename:function(req,file,cb){
        const name = Date.now()+"-"+file.originalname;
        cb(null,name,function(error,success){
            if(error){
                console.log(error);
            }
        })
    }
})
module.exports = multer({storage:storage})



// // multerMiddleware.js
// const multer = require('multer');
// // const cloudinaryStorage = require('multer-storage-cloudinary');

// const cloudinaryStorage = require('multer-storage-cloudinary');
// const cloudinary = require('./cloudinary');

// const storage = cloudinaryStorage({
//   cloudinary: cloudinary,
//   folder: 'your_cloudinary_folder_name', // Optional: Set a specific folder in your Cloudinary account
//   allowedFormats: ['jpg', 'jpeg', 'png', 'gif'] // Optional: Specify the allowed file formats
// });

// const multerMiddleware = multer({ storage: storage });

// module.exports = multerMiddleware;
