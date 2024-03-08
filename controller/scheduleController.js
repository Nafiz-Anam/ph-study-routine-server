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

    getWeeklySchedule: async (req, res, next) => {
        try {
            const userId = req.user.id;

            const schedule = await ScheduleService.getWeeklyScheduleByUserId(
                userId
            );
            if (!schedule) {
                return res
                    .status(404)
                    .json({ message: "Schedule not found for this user." });
            }

            res.status(200).json(schedule);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    updateWeeklySchedule: async (req, res, next) => {
        try {
            const userId = req.user.id;
            const weeklySchedule = req.body.weeklySchedule;

            if (!weeklySchedule || weeklySchedule.length === 0) {
                return res
                    .status(400)
                    .json({ message: "Weekly schedule data is required." });
            }

            const updatedSchedule = await ScheduleService.updateWeeklySchedule(
                userId,
                weeklySchedule
            );
            res.status(200).json(updatedSchedule);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
};

module.exports = ScheduleController;
