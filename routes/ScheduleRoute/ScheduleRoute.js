const router = require("express").Router();
const checkUserToken = require("../../middleware/tokenmanager/checkUserToken");
const ScheduleController = require("../../controller/scheduleController");
const scheduleValidation = require("../../middleware/validations/scheduleValidation");

// user routes
router.post(
    "/initial",
    checkUserToken,
    scheduleValidation.createInitialWeeklySchedule,
    ScheduleController.createInitialWeeklySchedule
);

module.exports = router;
