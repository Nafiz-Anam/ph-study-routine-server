const router = require("express").Router();
const AuthRouter = require("./AuthRoute/AuthRoute");
const UserRouter = require("./UserRoute/UserRoute");
const ScheduleRouter = require("./ScheduleRoute/ScheduleRoute");

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);
router.use("/schedule", ScheduleRouter);

module.exports = router;
