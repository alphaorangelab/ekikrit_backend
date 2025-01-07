const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    imageList: {
        type: [
            {
                imageUrl: String,
                imageSize: Number,
                imageName: String,
            },
        ],
        default: undefined,
    },
});

module.exports = mongoose.model("gallery", gallerySchema);
