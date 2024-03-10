const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NeedSchema = new Schema(
    {
        name: { type: String, required: true },
        timeNeeded: { type: Number, required: true },
        priority: {
            type: String,
            enum: ["high", "medium", "low"],
            default: "medium",
        },
    },
    { _id: false }
);

const UserNeedsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    needs: [NeedSchema],
});

module.exports = mongoose.model("UserNeed", UserNeedsSchema);
