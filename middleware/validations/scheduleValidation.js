const Joi = require("joi");

const validDaysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const scheduleValidation = {
    createInitialWeeklySchedule: async (req, res, next) => {
        try {
            const timeBlockSchema = Joi.object({
                reason: Joi.string()
                    .valid("class", "work", "study", "other")
                    .required(),
                startTime: Joi.string().required(),
                endTime: Joi.string().required(),
                subject: Joi.string().allow("", null),
                location: Joi.string().allow("", null),
            }).required();

            const dayScheduleSchema = Joi.object({
                day: Joi.string()
                    .valid(...validDaysOfWeek)
                    .required(),
                timeBlocks: Joi.array().items(timeBlockSchema),
            }).required();

            const weeklyScheduleSchema = Joi.array()
                .items(dayScheduleSchema)
                .required()
                .min(7)
                .unique((a, b) => a.day === b.day);

            const { error } = weeklyScheduleSchema.validate(
                req?.body?.weeklySchedule,
                { abortEarly: false }
            );

            const days = req?.body?.weeklySchedule.map(
                (schedule) => schedule.day
            );
            const missingDays = validDaysOfWeek.filter(
                (day) => !days.includes(day)
            );

            if (missingDays.length > 0) {
                return res.status(400).json({
                    status: false,
                    message: `Missing schedules for: ${missingDays.join(", ")}`,
                });
            }

            if (error) {
                const missingDayIndex = error?.details[0]?.path[0];
                const missingDay =
                    req?.body?.weeklySchedule[missingDayIndex]?.day;
                const errorMessage = `Missing time blocks for ${missingDay}`;
                return res.status(400).json({
                    status: false,
                    message: errorMessage,
                });
            }

            next();
        } catch (error) {
            // console.error(
            //     "An error occurred during schedule validation:",
            //     error
            // );
            res.status(500).json({
                status: false,
                message: "Internal server error",
            });
        }
    },
};

module.exports = scheduleValidation;
