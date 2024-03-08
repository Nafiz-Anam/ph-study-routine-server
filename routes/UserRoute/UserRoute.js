const router = require("express").Router();
const UserController = require("../../controller/userController");
const checkUserToken = require("../../middleware/tokenmanager/checkUserToken");
const ProfileUploader = require("../../uploads/ProfileUploader");

// user routes
router.put("/update", checkUserToken, ProfileUploader, UserController.update);
router.get("/profile", checkUserToken, UserController.details);

module.exports = router;
