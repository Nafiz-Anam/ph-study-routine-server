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
};

module.exports = UserController;
