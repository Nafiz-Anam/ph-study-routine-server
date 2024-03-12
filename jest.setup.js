const { connectDB } = require("./config/database");

module.exports = async () => {
    process.env.NODE_ENV = "test";
    await connectDB();
};
