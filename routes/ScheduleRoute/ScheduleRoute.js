const router = require("express").Router();
const checkUserToken = require("../../middleware/tokenmanager/checkUserToken");
const ScheduleController = require("../../controller/scheduleController");
const scheduleValidation = require("../../middleware/validations/scheduleValidation");

// schedule routes
router.post(
    "/initial",
    checkUserToken,
    scheduleValidation.createInitialWeeklySchedule,
    ScheduleController.createOrUpdateWeeklySchedule
);

router.get("/initial", checkUserToken, ScheduleController.getWeeklySchedule);

module.exports = router;
