const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Gallery = require("../model/gallerySchema");

const checkAuth = require("../middleware/check-auth");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

router.get("/", async (req, res, next) => {
    try {
        const galleryList = await Gallery.find();
        return res.json({ success: true, galleryList });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/:id", async (req, res, next) => {
    const id = req.params.id;

    try {
        const gallery = await Gallery.findById(id);

        if (!gallery) {
            return res.status(404).json({ message: "Gallery not found" });
        }

        return res.json({ success: true, gallery });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/", checkAuth, async (req, res) => {
    try {
        // Extract data from the request body
        const { title, description, imageList } = req.body;

        // Create a new Gallery document
        const newGalleryItem = new Gallery({
            _id: new mongoose.Types.ObjectId(),
            title,
            description,
            imageList,
        });

        // Save the document to the database
        const savedGalleryItem = await newGalleryItem.save();

        res.status(200).json({ success: true, gallery: savedGalleryItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put("/:id", async (req, res, next) => {
    const galleryId = req.params.id;
    const { title, description, imageList } = req.body; // Assuming you send updated data in the request body

    try {
        const gallery = await Gallery.findById(galleryId);

        if (!gallery) {
            return res.status(404).json({ message: "Gallery not found" });
        }

        // Update the gallery properties
        gallery.title = title || gallery.title;
        gallery.description = description || gallery.description;
        gallery.imageList = imageList || gallery.imageList;

        // Save the updated gallery
        await gallery.save();

        return res.json({ success: true, gallery });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Find the document by ID
        const deletedGalleryItem = await Gallery.findById(id);

        // Check if the document was found
        if (!deletedGalleryItem) {
            return res.status(404).json({ message: "Gallery item not found" });
        }

        // Ensure that the imageList is not empty
        if (
            !deletedGalleryItem.imageList ||
            deletedGalleryItem.imageList.length === 0
        ) {
            return res
                .status(400)
                .json({ message: "Image list is empty for the gallery item" });
        }

        // Delete each file in the imageList
        for (const image of deletedGalleryItem.imageList) {
            // Ensure that the imageUrl is set in the image object
            if (!image.imageUrl) {
                console.error("Image URL is missing for image:", image);
                continue; // Skip to the next image if imageUrl is missing
            }

            // Extract the filename from the imageUrl
            const filename = path.basename(image.imageUrl);
            console.log(filename, __dirname, "file names");

            // Construct the file path
            const filePath = path.resolve(
                __dirname,
                "..",
                "..",
                "uploads",
                filename
            );
            // console.log(filePath, "file path");

            // Delete the corresponding file from the upload folder
            await unlinkAsync(filePath);

            // console.log("File deleted successfully:", filePath);
        }

        // Remove the document from the database
        await Gallery.findByIdAndDelete(id);

        res.status(200).json({
            message: "Gallery item deleted successfully",
            deletedGalleryItem,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
