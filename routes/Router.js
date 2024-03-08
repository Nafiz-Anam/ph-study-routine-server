const router = require("express").Router();
const AuthRouter = require("./AuthRoute/AuthRoute");

router.use("/auth", AuthRouter);

module.exports = router;
