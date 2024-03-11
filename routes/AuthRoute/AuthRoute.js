const router = require("express").Router();
const authController = require("../../controller/authController");
const authValidation = require("../../middleware/validations/authValidation");

// auth routes
router.post("/register", authValidation.register, authController.registration);

router.post("/login", authValidation.login, authController.login);

router.post(
    "/request-password-reset",
    authValidation.requestPasswordReset,
    authController.requestPasswordReset
);

router.post(
    "/reset-password/:token",
    authValidation.resetPassword,
    authController.resetPassword
);

module.exports = router;
