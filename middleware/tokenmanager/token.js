const jwt = require("jsonwebtoken");

const generateAuthToken = (userPayload) => {
    const token = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "7 days",
    });
    return token;
};

module.exports = generateAuthToken;
