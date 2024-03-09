const UserService = require("../service/user.service");
let static_url = process.env.STATIC_FILE_URL;

require("dotenv").config();

var UserController = {
    update: async (req, res, next) => {
        try {
            const { f_name, l_name, mobile, education_level, institution } =
                req.body;
            const userId = req.user.id;

            console.log(req.all_files.profile_img);

            // Update the user profile
            await UserService.update(userId, {
                f_name,
                l_name,
                mobile,
                education_level,
                institution,
                profilePicture:
                    static_url + "user/" + req?.all_files?.profile_img || "",
            });

            res.status(201).json({
                message: "Profile updated successfully",
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    details: async (req, res, next) => {
        try {
            const userId = req.user.id;
            const userDetails = await UserService.details(userId);

            res.json({
                message: "Detailed profile fetched successfully",
                profile: userDetails,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    addNeeds: async (req, res, next) => {
        try {
            const userId = req.user.id;
            const { needs } = req.body;

            if (!needs || needs.length === 0) {
                return res.status(400).json({ message: "Needs are required." });
            }

            const newNeeds = await UserService.addUserNeeds(userId, needs);
            console.log("newNeeds", newNeeds);
            res.status(201).json(newNeeds);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    generateStudyPlanForUser: async (req, res, next) => {
        try {
            const userId = req.user.id;
            const studyPlan = await UserService.generateStudyPlanForUser(userId);

            res.json({ studyPlan });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Failed to generate study plan.",
            });
        }
    },
};

module.exports = UserController;
