require("dotenv").config();
const AuthService = require("../service/auth.service");
const generateAuthToken = require("../middleware/tokenmanager/token");

var AuthController = {
    registration: async (req, res, next) => {
        try {
            const { email, password } = req?.body;
            const { user, token } = await AuthService.registerNewUser({
                email,
                password,
            });

            const userResponse = {
                id: user?._id,
                email: user?.email,
                token,
            };

            res.status(201).json({
                status: true,
                message: "User signed up successfully.",
                data: userResponse,
            });
        } catch (error) {
            // console.log(error);
            res.status(500).json({
                status: false,
                message: error?.message || "Internal server error!",
            });
        }
    },

    login: async (req, res, next) => {
        try {
            const { email, password } = req?.body;
            const { user, token } = await AuthService.loginUser(
                email,
                password
            );

            const userResponse = {
                id: user?._id,
                name: user?.name,
                token,
            };

            res.status(201).json({
                status: true,
                message: "User signed in successfully.",
                data: userResponse,
            });
        } catch (error) {
            // console.log(error);
            res.status(500).json({
                status: false,
                message: error?.message || "Internal server error!",
            });
        }
    },

    requestPasswordReset: async (req, res, next) => {
        try {
            await AuthService.requestPasswordReset(req.body.email);
            res.status(200).json({
                message: "Password reset token sent to email!",
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    resetPassword: async (req, res, next) => {
        try {
            const user = await AuthService.resetPassword(
                req.params.token,
                req.body.newPassword
            );
            const tokenPayload = {
                id: user._id,
                role: user.role,
            };
            const token = generateAuthToken(tokenPayload);
            res.status(200).json({
                message: "Password successfully reset!",
                token,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = AuthController;
