
// const cookieParser =require("cookie-parser")
// const express = require('express');
// const app=express();
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path=require('path')
// require("dotenv").config()
//  const userRouter = require("./routes/UserRoute");
// const adminRouter = require("./routes/AdminRoute");
// const vendorRouter = require("./routes/VendorRoute");
// const nodemailer = require('nodemailer')

// // Middleware
// app.use(express.json());
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// app.use(cookieParser());
// app.use(express.static(path.join(__dirname,'public')))
// app.options('*', cors());

//  app.use("/", userRouter);
// app.use("/admin",adminRouter);
// app.use("/vendor",vendorRouter);

// mongoose.connect(process.env.db_Connection).then(()=>{
//     app.listen(5000,()=>{console.log('server running.... on port 5000')
// })
// })


// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: process.env.your_cloud_name,
//   api_key: process.env.your_api_key,
//   api_secret: process.env.your_api_secret
// });


// const cookieParser = require("cookie-parser");
// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// require("dotenv").config();
// const userRouter = require("./routes/UserRoute");
// const adminRouter = require("./routes/AdminRoute");
// const vendorRouter = require("./routes/VendorRoute");
// const nodemailer = require('nodemailer');
// const cloudinary = require('cloudinary').v2;
// const { Server } = require('socket.io');
// const http = require("http");
// const corsOrigin = process.env.Cors_URL || 'http://localhost:3000'
// // Middleware
// app.use(express.json());
// // app.use(cors({ origin: 'http://localhost:3000' , credentials: true }));

// // app.use(cors({ origin: corsOrigin , credentials: true }));
// app.use(cors({ origin: corsOrigin, credentials: true }));

// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.options('*', cors());

// app.use("/", userRouter);
// app.use("/admin", adminRouter);
// app.use("/vendor", vendorRouter);

// mongoose.connect(process.env.db_Connection).then(() => {
//     const server = http.createServer(app);

//     // const io = new Server(server, {
//     //     cors: {
//     //         origin: corsOrigin,
//     //         // origin: 'http://localhost:3000',
//     //         methods: ["GET", "POST"],
//     //     },
//     // });

//     const io = new Server(server, {
//         cors: {
//             origin: corsOrigin,
//             methods: ["GET", "POST"],
//         },
//     });
    

//     io.on("connection", (socket) => {
//         console.log(`User Connected: ${socket.id}`);

//         socket.on('message', (data) => {

//             console.log(data.newtext);

//             io.emit("receive_message", data.newtext);
//         });
//     });

//     server.listen(process.env.PORT || 5000, () => {
//         console.log("Express server with Socket.IO running on port 5000");
//     });
// });

// cloudinary.config({
//     cloud_name: process.env.your_cloud_name,
//     api_key: process.env.your_api_key,
//     api_secret: process.env.your_api_secret
// });


const cookieParser = require("cookie-parser");
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require("dotenv").config();
const userRouter = require("./routes/UserRoute");
const adminRouter = require("./routes/AdminRoute");
const vendorRouter = require("./routes/VendorRoute");
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;
const { Server } = require('socket.io');
const http = require("http");
const corsOrigin = process.env.Cors_URL || 'http://localhost:3000';


// const customCors = (req, callback) => {
 
//   const requestedEndpoint = req.originalUrl.split('/')[1];
  
  
//   if (requestedEndpoint === 'admin' || requestedEndpoint === 'vendor') {
//     callback(null, true);
//   } else if (req.header('Origin') === corsOrigin) {
//     callback(null, true);
//   } else {
//     callback(new Error('Not allowed by CORS'));
//   }
// };

// Custom CORS middleware to handle multiple endpoints
const customCors = (req, callback) => {
    // Extract the requested endpoint from the URL
    const originalUrl = req.originalUrl || '';
  
    const requestedEndpoint = originalUrl.split('/')[1];

    
    
    // Allow CORS for the main origin or specific endpoints
    if (requestedEndpoint === 'admin' || requestedEndpoint === 'vendor') {
      callback(null, true);
    } else if (originalUrl == corsOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  };
  

// Middleware
app.use(express.json());

app.use(cors({
  origin: customCors,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.options('*', cors());

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/vendor", vendorRouter);

mongoose.connect(process.env.db_Connection).then(() => {
    const server = http.createServer(app);

    const io = new Server(server, {
        cors: {
            origin: corsOrigin,
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on('message', (data) => {
            console.log(data.newtext);
            io.emit("receive_message", data.newtext);
        });
    });

    server.listen(process.env.PORT || 5000, () => {
        console.log("Express server with Socket.IO running on port 5000");
    });
});


cloudinary.config({
    cloud_name: process.env.your_cloud_name,
    api_key: process.env.your_api_key,
    api_secret: process.env.your_api_secret
});
