const UserService = require("../service/user.service");
let static_url = process.env.STATIC_FILE_URL;

require("dotenv").config();

var UserController = {
    update: async (req, res, next) => {
        try {
            const { f_name, l_name, mobile, education_level, institution } =
                req.body;
            const userId = req?.user?.id;

            if (
                !req?.file &&
                !req?.all_files?.profilePicture &&
                !req?.body?.profilePicture
            ) {
                return res.status(400).json({
                    status: false,
                    message: "Profile image is required.",
                });
            }

            const profilePicturePath = req?.all_files?.profilePicture
                ? `${static_url}user/${req?.all_files?.profilePicture}`
                : "";

            let data = {
                f_name,
                l_name,
                mobile,
                education_level,
                institution,
            };

            if (req?.all_files && req?.all_files?.profilePicture) {
                data.profilePicture = profilePicturePath;
            }

            // Update the user profile
            await UserService.update(userId, data);

            res.status(201).json({
                status: true,
                message: "Profile updated successfully.",
            });
        } catch (error) {
            // console.log(error);
            res.status(500).json({
                status: false,
                message: error?.message || "Internal server error!",
            });
        }
    },

    details: async (req, res, next) => {
        try {
            const userId = req?.body?.userId || req?.user?.id;

            if (!userId) {
                return res
                    .status(400)
                    .json({ status: false, message: "User ID is required." });
            }

            const userDetails = await UserService.details(userId);

            res.status(201).json({
                status: true,
                message: "User Profile fetched successfully.",
                data: userDetails,
            });
        } catch (error) {
            // console.log(error);
            res.status(500).json({
                status: false,
                message: error?.message || "Internal server error!",
            });
        }
    },

    addNeeds: async (req, res, next) => {
        try {
            const userId = req?.user?.id;
            const { todo } = req?.body;

            if (!todo || todo.length === 0) {
                return res
                    .status(400)
                    .json({ status: false, message: "Needs are required." });
            }

            await UserService.addOrUpdateUserNeeds(userId, todo);

            res.status(201).json({
                status: true,
                message: "Todo tasks added successfully.",
            });
        } catch (error) {
            // console.log(error);
            res.status(500).json({
                status: false,
                message: error?.message || "Internal server error!",
            });
        }
    },

    incompleteTasks: async (req, res, next) => {
        try {
            const userId = req?.user?.id;

            const incompleteTasks = await UserService.getNeedsByUserId(userId);

            if (!incompleteTasks) {
                return res.status(404).json({
                    status: false,
                    message: "No todo tasks found for this user.",
                });
            }

            res.status(201).json({
                status: true,
                message: "Todo tasks fetched successfully.",
                data: incompleteTasks,
            });
        } catch (error) {
            // console.log(error);
            res.status(500).json({
                status: false,
                message: error?.message || "Internal server error!",
            });
        }
    },

    generateStudyPlanForUser: async (req, res, next) => {
        try {
            const userId = req?.user?.id;
            const studyPlan = await UserService.generateStudyPlanForUser(
                userId
            );

            res.status(201).json({
                status: true,
                message: "Study plan generated successfully.",
                data: studyPlan,
            });
        } catch (error) {
            // console.log(error);
            res.status(500).json({
                status: false,
                message: "Failed to generate study plan.",
            });
        }
    },
};

module.exports = UserController;
