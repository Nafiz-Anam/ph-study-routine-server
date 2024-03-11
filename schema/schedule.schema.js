const mongoose = require("mongoose");

const timeBlockSchema = new mongoose.Schema(
    {
        reason: {
            type: String,
            enum: ["class", "work", "other"],
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        subject: String, // Optional, mainly useful for 'class' reason
    },
    { _id: false }
); // Prevents mongoose from creating a separate _id for sub-documents

const dayScheduleSchema = new mongoose.Schema(
    {
        day: {
            type: String,
            enum: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
            required: true,
        },
        timeBlocks: {
            type: [timeBlockSchema],
            default: [], // Default value is an empty array
        },
    },
    { _id: false }
);

const userScheduleSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        weeklySchedule: [dayScheduleSchema],
    },
    { timestamps: true }
);

const UserSchedule = mongoose.model("UserSchedule", userScheduleSchema);

module.exports = UserSchedule;
