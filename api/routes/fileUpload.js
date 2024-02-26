const express = require("express");
const multer = require("multer");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const Jimp = require("jimp");
const path = require("path");

// Storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        // Generate a unique filename for uploaded files
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

// Maximum 5 files can be uploaded simultaneously
const upload = multer({ storage, limits: { files: 5 } });

router.post("/", checkAuth, upload.array("files", 5), async (req, res) => {
    try {
        const uploadedFiles = req.files;
        console.log(uploadedFiles, "uploaded files");

        // Array to store the filenames of the compressed files
        const compressedFileNames = [];

        // Iterate through each uploaded file
        for (const file of uploadedFiles) {
            // Compress the image and overwrite the original image
            await compressImage(file.path);

            // Add the filename of the compressed image to the array
            compressedFileNames.push(file.filename);
        }

        // Construct URLs for the compressed images
        const compressedFileUrls = compressedFileNames.map(
            (filename) => `http://localhost:3000/uploads/${filename}`
        );

        res.json({
            message: "Files uploaded and compressed successfully",
            urls: compressedFileUrls,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
async function compressImage(inputPath) {
    try {
        const image = await Jimp.read(inputPath);
        await image.quality(80).writeAsync(inputPath); // Overwrite original image
        console.log("Image compressed successfully.");
    } catch (error) {
        console.error("Error compressing image:", error);
        throw error;
    }
}

module.exports = router;
