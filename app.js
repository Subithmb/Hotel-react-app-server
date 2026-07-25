
// .................. working..................................

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
const https = require("https");
const corsOrigin = [process.env.Cors_URL,'http://localhost:3000']

app.use(express.json());
app.use(cors({ origin: corsOrigin, credentials: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.options('*', cors());

app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/vendor", vendorRouter);

function startKeepAlive() {
    const url = process.env.PUBLIC_URL;
    if (!url) {
        console.log("PUBLIC_URL environment variable is not set. Keep-alive ping disabled.");
        return;
    }

    console.log(`Keep-alive ping initialized targeting: ${url}`);
    
    // Set interval to ping every 10 minutes (600000 ms)
    setInterval(() => {
        const client = url.startsWith("https") ? https : http;
        client.get(`${url}/health`, (res) => {
            console.log(`Keep-alive ping successful. Status: ${res.statusCode}`);
        }).on("error", (err) => {
            console.error(`Keep-alive ping error: ${err.message}`);
        });
    }, 10 * 60 * 1000);
}

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
        socket.on('discount',()=>{
            console.log('disconnected');
        })
    });

    server.listen(process.env.PORT || 5000, () => {
        console.log("Express server with Socket.IO running on port 5000");
        startKeepAlive();
    });
});

cloudinary.config({
    cloud_name: process.env.your_cloud_name,
    api_key: process.env.your_api_key,
    api_secret: process.env.your_api_secret
});
