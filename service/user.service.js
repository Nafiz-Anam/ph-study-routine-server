const User = require("../schema/user.schema");

const UserService = {
    update: async (userId, updateData) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                updateData,
                { new: true }
            );
            if (!updatedUser) {
                throw new Error("User not found");
            }
            return updatedUser;
        } catch (error) {
            throw error;
        }
    },

    details: async (userId) => {
        try {
            const user = await User.findById(userId).select(
                "-password -__v -passwordResetToken -passwordResetExpires"
            );
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        } catch (error) {
            throw error;
        }
    },
};

module.exports = UserService;
