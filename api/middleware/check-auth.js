const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        console.log(token);
        const verify = jwt.verify(token, "ekikrit");
        next();
    } catch (err) {
        return res.status(401).json({
            error: true,
            msg: "invalid token",
        });
    }
};
