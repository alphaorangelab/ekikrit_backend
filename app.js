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
const healthRoute = require("./api/routes/health");

// MongoDB connection
// mongoose.connect(
//     "mongodb+srv://sanish:mongodb@ekikrit-cluster.djzio.mongodb.net/"
// );
mongoose.connect(
    "mongodb+srv://ekikrit12:GcdXxsb0rPunf4v8@cluster0.n6l8fkz.mongodb.net/?retryWrites=true&w=majority"
);

mongoose.connection.on("error", (error) => {
    console.log("Connection error:", error);
});

mongoose.connection.on("connected", () => {
    console.log("Connection success");
});

const uploadDirectory = path.join(__dirname, "uploads");

// CORS options
const corsOptions = {
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow credentials (like cookies)
};

// Middleware
app.use(cors(corsOptions)); // Use CORS with options
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/login", userRoute);
app.use("/notice", noticeRoute);
app.use("/upload", uploadRoute);

app.use("/gallery", galleryRoute);
app.use("/health", healthRoute);

app.use("/uploads", express.static(uploadDirectory));
app.get("/", (req, res) => {
    res.send("Server is running");
});

module.exports = app;
