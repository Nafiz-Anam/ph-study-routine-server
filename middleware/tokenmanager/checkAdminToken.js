const jwt = require("jsonwebtoken");
const helpers = require("../helper/general_helper");

module.exports = async function AuthenticateAccessToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            status: false,
            message: "No access token provided.",
        });
    }
    let session = await helpers.get_data_list("*", "sessions", {
        token: token,
    });

    if (session.length == 0) {
        return res.status(401).json({
            status: false,
            message: "Invalid access token.",
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            if (err.message === "jwt expired") {
                res.status(401).json({
                    status: false,
                    message: "Token Expired Please Login.",
                });
            } else {
                res.status(500).json({
                    status: false,
                    message: "Unable To Validate Token",
                });
            }
        } else if (user.role !== "admin") {
            res.status(403).json({
                status: false,
                message: "Forbidden access to this route.",
            });
        } else {
            req.user = user;
            next();
        }
    });
};
