const UserSchedule = require("../schema/schedule.schema");
const User = require("../schema/user.schema");
const UserNeed = require("../schema/userNeed.schema");
const helpers = require("../utilities/helper/general_helper");

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

    addUserNeeds: async (userId, needs) => {
        const userNeeds = new UserNeed({
            userId,
            needs,
        });

        let saveNeeds = await userNeeds.save();

        return saveNeeds;
    },

    addOrUpdateUserNeeds: async (userId, needs) => {
        try {
            const existingNeeds = await UserNeed.findOne({ userId });
            if (existingNeeds) {
                existingNeeds.todo = needs;
                await existingNeeds.save();
                return {
                    message: "Needs updated successfully.",
                    needs: existingNeeds.needs,
                };
            } else {
                const newNeeds = new UserNeed({ userId, needs });
                await newNeeds.save();
                return {
                    message: "Needs added successfully.",
                    needs: newNeeds.todo,
                };
            }
        } catch (error) {
            throw error;
        }
    },

    getNeedsByUserId: async (userId) => {
        try {
            const needs = await UserNeed.find({ userId }).select("-__v");
            if (!needs) {
                throw new Error("Todo tasks not found");
            }
            return needs[0];
        } catch (error) {
            throw error;
        }
    },

    generateStudyPlanForUser: async (userId, needs) => {
        try {
            const blockedTimeSlots = await UserSchedule.findOne({
                userId,
            }).lean();

            if (!blockedTimeSlots) {
                throw new Error("User's schedule not found");
            }

            const tasks = await UserNeed.find({ userId }).lean();
            if (!tasks || tasks.length === 0) {
                throw new Error("No study tasks found for the user");
            }

            // Calculate available time slots from the user's schedule
            const availableTimeSlots =
                helpers.calculateAvailableTimeSlots(blockedTimeSlots);

            // Sort tasks by priority and duration
            const sortedTasks = helpers.sortTasksByPriorityAndDuration(
                tasks[0].todo
            );

            // Allocate tasks to available time slots and generate the study plan
            const studyPlan = helpers.allocateTasksToTimeSlots(
                availableTimeSlots,
                sortedTasks
            );

            const freeTimeSlots = helpers.calculateFreeTimeSlots(
                studyPlan,
                blockedTimeSlots
            );

            studyPlan.freeTimeSlots = freeTimeSlots;

            return studyPlan;
        } catch (error) {
            console.error("Failed to generate study plan:", error);
            throw error;
        }
    },
};

module.exports = UserService;
