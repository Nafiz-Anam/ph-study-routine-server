const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    f_name: {
        type: String,
        default: "",
        trim: true,
    },
    l_name: {
        type: String,
        default: "",
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: 6,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    mobile: {
        type: String,
        default: "",
    },
    education_level: {
        type: String,
        default: "",
    },
    institution: {
        type: String,
        default: "",
    },
    passwordResetExpires: {
        type: String,
        default: "",
    },
    passwordResetToken: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save middleware to hash the password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate password reset token
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

    return resetToken;
};

module.exports = mongoose.model("User", userSchema);
