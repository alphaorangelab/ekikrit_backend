const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Gallery = require("../model/gallerySchema");

const checkAuth = require("../middleware/check-auth");

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
        // Find the document by ID and remove it
        const deletedGalleryItem = await Gallery.findByIdAndDelete(id);

        // Check if the document was found and deleted
        if (!deletedGalleryItem) {
            return res.status(404).json({ message: "Gallery item not found" });
        }

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
