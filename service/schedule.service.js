const UserSchedule = require("../schema/schedule.schema");

const ScheduleService = {
    createInitialWeeklySchedule: async (userId, weeklySchedule) => {
        const existingSchedule = await UserSchedule.findOne({ userId });

        if (existingSchedule) {
            throw new Error(
                "Schedule already exists for this user. Please update or modify the schedule."
            );
        }

        const newSchedule = new UserSchedule({
            userId,
            weeklySchedule,
        });

        await newSchedule.save();
        return newSchedule;
    },

    updateWeeklySchedule: async (userId, weeklySchedule) => {
        const existingSchedule = await UserSchedule.findOne({ userId });

        if (!existingSchedule) {
            throw new Error("Schedule not found for this user.");
        }

        existingSchedule.weeklySchedule = weeklySchedule;
        await existingSchedule.save();
        return existingSchedule;
    },
};

module.exports = ScheduleService;
