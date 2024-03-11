const jwt = require("jsonwebtoken");

module.exports = function AuthenticateAccessToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token === null) {
        res.status(500).json({
            status: false,
            message: "Invalid access token.",
        });
    } else {
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
            } else if (user.role !== "student") {
                res.status(403).json({
                    status: false,
                    message: "Forbidden access to this route.",
                });
            } else {
                req.user = user;
                next();
            }
        });
    }
};
