const express = require("express");
const multer = require("multer");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

// Storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// Maximum 5 files can be uploaded simultaneously
const upload = multer({ storage, limits: { files: 5 } });

router.post("/", checkAuth, upload.array("files", 5), async (req, res) => {
    try {
        const uploadedFiles = req.files;
        console.log(uploadedFiles, "uploaded files");

        // Process uploadedFiles as needed
        const fileUrls = uploadedFiles.map((file) => {
            const encodedFilename = encodeURIComponent(file.filename);
            return `http://localhost:3000/uploads/${encodedFilename}`;
        });

        res.json({ message: "Files uploaded successfully", urls: fileUrls });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
