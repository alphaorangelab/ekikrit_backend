const express = require("express");
const router = express.Router();
const User = require("../model/userSchema");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");

// router.post("/", (req, res, next) => {
//     bcrypt.hash(req.body.password, 10, (err, hash) => {
//         if (err) {
//             return res.status(500).json({
//                 error: true,
//                 msg: err.message,
//             });
//         } else {
//             const user = new User({
//                 _id: new mongoose.Types.ObjectId(),
//                 userName: req.body.userName,
//                 password: hash,
//             });
//             user.save()
//                 .then((result) => {
//                     res.status(200).json({ success: true, user: result });
//                 })
//                 .catch((err) => {
//                     res.status(500).json({ error: true, msg: err.message });
//                 });
//         }
//     });
// });

router.post("/", (req, res, next) => {
    User.find({ userName: req.body.userName })
        .exec()
        .then((user) => {
            if (user.length < 0) {
                return res.status(401).json({
                    error: true,
                    msg: "User not found",
                });
            }
            bcrypt.compare(
                req.body.password,
                user[0].password,
                (err, result) => {
                    if (!result) {
                        return res.status(401).json({
                            error: true,
                            msg: "Password does not match",
                        });
                    }
                    if (result) {
                        const token = jwt.sign(
                            { userName: user[0].userName },
                            "ekikrit",
                            { expiresIn: "24h" }
                        );

                        res.status(200).json({
                            userName: user[0].userName,
                            token: token,
                        });
                    }
                }
            );
        })
        .catch((err) => res.status(500).json({ error: true }));
});

module.exports = router;
