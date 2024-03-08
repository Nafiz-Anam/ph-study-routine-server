const User = require("../schema/user.schema");
const sendPasswordResetEmail = require("../utilities/mail/sendPasswordResetEmail");
const generateAuthToken = require("../middleware/tokenmanager/token");
const crypto = require("crypto");

const AuthService = {
    registerNewUser: async (userData) => {
        try {
            const user = new User(userData);
            let savedUser = await user.save();

            const tokenPayload = {
                id: savedUser._id,
                role: savedUser.role,
            };
            const token = await generateAuthToken(tokenPayload);

            return { user, token };
        } catch (error) {
            throw error;
        }
    },

    loginUser: async (email, password) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found!");
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error("Invalid user/password!");
        }

        const tokenPayload = {
            id: user._id,
            role: user.role,
        };
        const token = await generateAuthToken(tokenPayload);

        return { user, token };
    },

    requestPasswordReset: async (email) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("There is no user with that email address.");
        }

        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        try {
            await sendPasswordResetEmail(user.email, resetToken);
            return true;
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });
            throw new Error(
                "There was an error sending the email. Try again later."
            );
        }
    },

    resetPassword: async (token, newPassword) => {
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            throw new Error("Token is invalid or has expired");
        }

        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        return user;
    },
};

module.exports = AuthService;
