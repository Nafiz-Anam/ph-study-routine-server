const router = require("express").Router();
const UserController = require("../../controller/userController");
const checkUserToken = require("../../middleware/tokenmanager/checkUserToken");
const checkPermission = require("../../middleware/tokenmanager/checkPermission");
const ProfileUploader = require("../../uploads/ProfileUploader");
const userValidation = require("../../middleware/validations/userValidation");

// user routes
router.put(
    "/update",
    checkUserToken,
    ProfileUploader,
    userValidation.update,
    UserController.update
);

router.get("/profile", checkPermission, UserController.details);

router.post(
    "/needs",
    checkUserToken,
    userValidation.addNeeds,
    UserController.addNeeds
);

router.get(
    "/needs",
    checkUserToken,
    UserController.incompleteTasks
);

router.get(
    "/study-plan",
    checkUserToken,
    UserController.generateStudyPlanForUser
);

module.exports = router;
