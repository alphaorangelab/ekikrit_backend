const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
    notice: Boolean,
    noticeUrl: String,
});

module.exports = mongoose.model("notice", noticeSchema);
