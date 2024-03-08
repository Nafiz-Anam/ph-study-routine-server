const router = require("express").Router();
const UserController = require("../../controller/userController");
const checkUserToken = require("../../middleware/tokenmanager/checkUserToken");
const checkPermission = require("../../middleware/tokenmanager/checkPermission");
const ProfileUploader = require("../../uploads/ProfileUploader");

// user routes
router.put("/update", checkUserToken, ProfileUploader, UserController.update);
router.get("/profile", checkPermission, UserController.details);

module.exports = router;
