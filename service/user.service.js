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

    // generateStudyPlanForUser: async (userId, needs) => {
    //     const blockedTimeSlots = await UserSchedule.findOne({ userId }).lean();
    //     console.log("blockedTimeSlots =>", blockedTimeSlots);
    //     const tasks = await UserNeed.find({ userId }).lean();
    //     console.log("tasks =>", tasks);
    //     const sortedTasks = helpers.sortTasksByPriorityAndDuration(
    //         tasks?.needs
    //     );
    //     console.log("sortedTasks =>", sortedTasks);
    //     const availableTimeSlots =
    //         helpers.consolidateAvailableTime(blockedTimeSlots);
    //     console.log("availableTimeSlots =>", availableTimeSlots);
    //     const studyPlan = helpers.allocateTasksToTimeSlots(
    //         availableTimeSlots,
    //         sortedTasks
    //     );

    //     return studyPlan;
    // },

    generateStudyPlanForUser: async (userId, needs) => {
        try {
            const blockedTimeSlots = await UserSchedule.findOne({
                userId,
            }).lean();
            if (!blockedTimeSlots) {
                throw new Error("User's schedule not found");
            }

            const tasks = await UserNeed.find({ userId }).lean();
            console.log(tasks);
            if (!tasks || tasks.length === 0) {
                throw new Error("No study tasks found for the user");
            }

            // Calculate available time slots from the user's schedule
            const availableTimeSlots =
                helpers.calculateAvailableTimeSlots(blockedTimeSlots);

            // Sort tasks by priority and duration
            const sortedTasks = helpers.sortTasksByPriorityAndDuration(tasks[0].needs);

            // Allocate tasks to available time slots and generate the study plan
            const studyPlan = helpers.allocateTasksToTimeSlots(
                availableTimeSlots,
                sortedTasks
            );

            return studyPlan;
        } catch (error) {
            console.error("Failed to generate study plan:", error);
            throw error; // Rethrow to handle in the controller
        }
    },
};

module.exports = UserService;
