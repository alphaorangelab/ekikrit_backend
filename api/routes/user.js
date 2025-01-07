const express = require("express");
const router = express.Router();
const User = require("../model/userSchema");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", (req, res, next) => {
    User.find({ userName: req.body.userName })
        .exec()
        .then((user) => {
            // Change to user.length === 0 to correctly check if no users are found
            if (user.length === 0) {
                return res.status(401).json({
                    error: true,
                    msg: "You entered a wrong username or password!!!", // More descriptive error message
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        error: true,
                        msg: "An error occurred while checking password",
                    });
                }

                if (!result) {
                    return res.status(401).json({
                        error: true,
                        msg: "You entered a wrong username or password", // Same message for wrong password
                    });
                }

                if (result) {
                    const token = jwt.sign(
                        { userName: user[0].userName },
                        "ekikrit",
                        { expiresIn: "24h" }
                    );

                    return res.status(200).json({
                        userName: user[0].userName,
                        token: token,
                    });
                }
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: true, msg: "Server error" });
        });
});

module.exports = router;
