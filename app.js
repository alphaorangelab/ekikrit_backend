const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors"); // Import the cors middleware
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoute = require("./api/routes/user");
const noticeRoute = require("./api/routes/notice");
const uploadRoute = require("./api/routes/fileUpload");
const galleryRoute = require("./api/routes/gallery");

mongoose.connect(
    "mongodb+srv://avinashshrestha2017:password2024@ekikrit.pw0ji6u.mongodb.net/?retryWrites=true&w=majority"
);

mongoose.connection.on("error", (error) => {
    console.log("connection error");
});

mongoose.connection.on("connected", (connected) => {
    console.log("connection success");
});

const uploadDirectory = path.join(__dirname, "uploads");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());
app.use("/login", userRoute);
app.use("/notice", noticeRoute);
app.use("/upload", uploadRoute);
app.use("/gallery", galleryRoute);
app.use("/uploads", express.static(uploadDirectory));

module.exports = app;
