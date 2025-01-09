const express = require("express");
const router = express.Router();
const Notice = require("../model/noticeSchema");
const multer = require("multer");
const path = require("path");

const checkAuth = require("../middleware/check-auth");

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Adjust the destination as needed
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the file name
    },
});

const upload = multer({ storage: storage });

// Route to handle file uploads
router.post("/upload", checkAuth, upload.array("files", 5), (req, res) => {
    const urls = req.files.map((file) => `/${file.path}`); // Adjust URL path as needed
    return res.status(200).json({ urls });
});

router.post("/", checkAuth, async (req, res) => {
    const { notice, noticeUrls } = req.body;

    try {
        // Create a new notice instance
        const newNotice = new Notice({
            notice: notice,
            noticeUrls: noticeUrls,
        });

        // Save the new notice
        const savedNotice = await newNotice.save();

        return res.status(201).json({
            message: "Notice created successfully",
            notice: savedNotice,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const allNotices = await Notice.find();
        console.log(allNotices, "allNotices");
        return res.json(allNotices);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put("/:id", checkAuth, async (req, res) => {
    console.log("Incoming Request:", req.params, req.body); // Log the params and body
    const { id } = req.params;
    const { notice, noticeUrls } = req.body;

    console.log(notice, noticeUrls, "at the this");

    try {
        const updatedData = {
            notice: notice,
            noticeUrls: noticeUrls,
        };
        const updatedNotice = await Notice.findByIdAndUpdate(id, updatedData, {
            new: true,
        });
        console.log(updatedNotice, "updated notice");

        if (!updatedNotice) {
            return res.status(404).json({ message: "Notice not found" });
        }

        return res.status(200).json({ updatedNotice });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
