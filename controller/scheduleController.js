const UserSchedule = require("../schema/schedule.schema");
const ScheduleService = require("../service/schedule.service");

require("dotenv").config();

var ScheduleController = {
    createOrUpdateWeeklySchedule: async (req, res, next) => {
        try {
            const userId = req?.user?.id;
            const weeklySchedule = req?.body?.weeklySchedule;

            if (!weeklySchedule || weeklySchedule.length === 0) {
                return res.status(400).json({
                    status: false,
                    message: "Weekly schedule data is required.",
                });
            }

            let existingSchedule = await UserSchedule.findOne({ userId });

            if (existingSchedule) {
                existingSchedule.weeklySchedule = weeklySchedule;
                await existingSchedule.save();

                res.status(201).json({
                    status: true,
                    message: "Block-logs updated successfully.",
                });
            } else {
                await ScheduleService.createInitialWeeklySchedule(
                    userId,
                    weeklySchedule
                );

                res.status(201).json({
                    status: true,
                    message: "Block-logs added successfully.",
                });
            }
        } catch (error) {
            // console.log(error);
            res.status(500).json({
                status: false,
                message: error?.message || "Internal server error!",
            });
        }
    },

    getWeeklySchedule: async (req, res, next) => {
        try {
            const userId = req?.user?.id;

            const schedule = await ScheduleService.getWeeklyScheduleByUserId(
                userId
            );
            if (!schedule) {
                return res.status(404).json({
                    status: false,
                    message: "Block-logs not found for this user.",
                });
            }

            res.status(201).json({
                status: true,
                message: "Block-logs fetched successfully.",
                data: schedule,
            });
        } catch (error) {
            // console.log(error);
            res.status(500).json({
                status: false,
                message: error?.message || "Internal server error!",
            });
        }
    },
};

module.exports = ScheduleController;
