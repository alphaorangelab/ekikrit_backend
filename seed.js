const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const File = require("./api/model/fileUpload"); // Adjust the path if necessary
const Gallery = require("./api/model/gallerySchema");
const Notice = require("./api/model/noticeSchema");
const User = require("./api/model/userSchema");

// Replace this with your actual MongoDB connection string
const mongoDBURI = "mongodb+srv://sanish:mongodb@ekikrit-cluster.djzio.mongodb.net/";

mongoose
    .connect(mongoDBURI)
    .then(async () => {
        console.log("Connected to MongoDB");

        // Clear existing data
        await File.deleteMany({});
        await Gallery.deleteMany({});
        await Notice.deleteMany({});
        await User.deleteMany({});

        // Sample data
        const files = [
            { filename: "image1.jpg", path: "/uploads/image1.jpg" },
            { filename: "image2.jpg", path: "/uploads/image2.jpg" },
        ];

        const galleries = [
            {
                _id: new mongoose.Types.ObjectId(),
                title: "Nature Gallery",
                description: "A collection of nature images.",
                imageList: [
                    {
                        imageUrl: "/images/nature1.jpg",
                        imageSize: 200,
                        imageName: "Nature 1",
                    },
                    {
                        imageUrl: "/images/nature2.jpg",
                        imageSize: 300,
                        imageName: "Nature 2",
                    },
                ],
            },
        ];

        const notices = [
            { notice: true, noticeUrl: "http://example.com/notice1" },
        ];

        // Hash the password
        const hashedPassword = await bcrypt.hash("securepassword", 10); // Hash the password

        const users = [
            { _id: new mongoose.Types.ObjectId(), userName: "testuser", password: hashedPassword }, // Use hashed password
        ];

        // Save data
        await File.insertMany(files);
        await Gallery.insertMany(galleries);
        await Notice.insertMany(notices);
        await User.insertMany(users);

        console.log("Sample data added");
        mongoose.connection.close();
    })
    .catch((err) => console.error("Database connection error:", err));
