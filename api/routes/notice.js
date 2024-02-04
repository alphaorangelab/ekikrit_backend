const express = require("express");
const router = express.Router();
const Notice = require("../model/noticeSchema");

const checkAuth = require("../middleware/check-auth");

router.get("/", async (req, res, next) => {
    try {
        const allNotices = await Notice.find();
        return res.json(allNotices);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put("/:id", checkAuth, async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body, "here");
    const { notice, noticeUrl } = req.body;

    console.log(notice);
    const updatedData = {
        notice: notice,
        noticeUrl: noticeUrl,
    };
    try {
        const updatedNotice = await Notice.findByIdAndUpdate(id, updatedData, {
            new: true,
        });

        if (!updatedNotice) {
            return res.status(404).json({ message: "notice not found" });
        }

        return res.status(200).json({ updatedNotice });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
