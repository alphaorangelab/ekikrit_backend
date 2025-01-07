const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
    notice: {
        type: Boolean,
        required: true,
    },
    noticeUrls: {
        type: [String], // Array of notice URLs
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Notice", noticeSchema);
