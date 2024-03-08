const ScheduleService = require("../service/schedule.service");

require("dotenv").config();

var ScheduleController = {
    createInitialWeeklySchedule: async (req, res, next) => {
        try {
            const userId = req.user.id;
            const weeklySchedule = req.body.weeklySchedule;

            if (!weeklySchedule || weeklySchedule.length === 0) {
                return res
                    .status(400)
                    .json({ message: "Weekly schedule data is required." });
            }

            const newSchedule =
                await ScheduleService.createInitialWeeklySchedule(
                    userId,
                    weeklySchedule
                );
            res.status(201).json(newSchedule);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
};

module.exports = ScheduleController;
