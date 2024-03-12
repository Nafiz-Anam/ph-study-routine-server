const mongoose = require("mongoose");

let mongoServer;

const connectDB = async () => {
    if (process.env.NODE_ENV === "test") {
        const { MongoMemoryServer } = require("mongodb-memory-server");
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
    } else {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
};

const closeDatabase = async () => {
    if (process.env.NODE_ENV === "test") {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        if (mongoServer) {
            await mongoServer.stop();
        }
    }
};

module.exports = { connectDB, closeDatabase };
