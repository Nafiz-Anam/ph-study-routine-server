const router = require("express").Router();
const AuthRouter = require("./AuthRoute/AuthRoute");
const UserRouter = require("./UserRoute/UserRoute");

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);

module.exports = router;
