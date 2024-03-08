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

router.put(
    "/initial/update",
    checkUserToken,
    scheduleValidation.createInitialWeeklySchedule,
    ScheduleController.updateWeeklySchedule
);

module.exports = router;
