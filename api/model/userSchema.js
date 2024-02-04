const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userName: String,
    password: String,
});

module.exports = mongoose.model("user", userSchema);
