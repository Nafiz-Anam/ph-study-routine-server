const { closeDatabase } = require("./config/database");

module.exports = async () => {
    await closeDatabase();
};
