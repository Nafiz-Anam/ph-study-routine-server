const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const compression = require("compression");
const helmet = require("helmet");

//route import
const Router_v1 = require("./routes/Router");
const { connectDB } = require("./config/database");

const app = express();

//middle-wares
app.use(cors());
app.use(express.json());
app.use(compression());
app.use(helmet());

// Connect to the database
connectDB();

// using static files
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/api/v1", Router_v1);

app.get("/", (req, res) => {
    res.send("Welcome to Study Planner Api Server.");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong. Try again!");
});

module.exports = app;
