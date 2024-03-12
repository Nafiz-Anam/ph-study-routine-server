const Joi = require("joi");
const helpers = require("../../utilities/helper/general_helper");

const authValidation = {
    register: async (req, res, next) => {
        const registerSchema = Joi.object({
            email: Joi.string().required().email().messages({
                "any.required": "Email is required",
                "string.email": "Email must be a valid email address",
                "string.empty": "Email cannot be empty",
            }),
            password: Joi.string().required().min(6).max(16).messages({
                "any.required": "Password is required",
                "string.min": "Password must be at least 6 characters long",
                "string.max": "Password cannot exceed 16 characters",
                "string.empty": "Password cannot be empty",
            }),
        });

        try {
            const result = registerSchema.validate(req?.body);
            const userAvailable = await helpers.userAvailable(req?.body?.email);
            if (result.error) {
                return res.status(400).json({
                    status: false,
                    message: result?.error?.message,
                });
            }
            if (userAvailable) {
                return res.status(500).json({
                    status: false,
                    message: "Email already signed up. Sign in to continue.",
                });
            }
            next();
        } catch (error) {
            // console.log(error);
            res.status(500).json({
                status: false,
                message: "Server side error!",
            });
        }
    },

    login: async (req, res, next) => {
        const loginSchema = Joi.object({
            email: Joi.string().required().email().messages({
                "any.required": "Email is required",
                "string.email": "Email must be a valid email address",
                "string.empty": "Email cannot be empty",
            }),
            password: Joi.string().required().min(6).max(16).messages({
                "any.required": "Password is required",
                "string.min": "Password must be at least 6 characters long",
                "string.max": "Password cannot exceed 16 characters",
                "string.empty": "Password cannot be empty",
            }),
        });

        try {
            const result = loginSchema.validate(req?.body);
            if (result.error) {
                return res.status(400).json({
                    status: false,
                    message: result?.error?.message,
                });
            }
            next();
        } catch (error) {
            // console.log(error);
            res.status(500).json({
                status: false,
                message: "Server side error!",
            });
        }
    },

    requestPasswordReset: async (req, res, next) => {
        const passwordResetRequestValidation = Joi.object({
            email: Joi.string().email().required().messages({
                "string.email": "Please provide a valid email address",
                "any.required": "Email is required",
                "string.empty": "Email cannot be empty",
            }),
        });

        const { error } = passwordResetRequestValidation.validate(req?.body);
        if (error) {
            return res
                .status(400)
                .json({ status: false, message: error?.details[0]?.message });
        }
        next();
    },

    resetPassword: async (req, res, next) => {
        const passwordResetValidation = Joi.object({
            newPassword: Joi.string().min(6).max(16).required().messages({
                "any.required": "Password is required",
                "string.min": "Password must be at least 6 characters long",
                "string.max": "Password cannot exceed 16 characters",
                "string.empty": "Password cannot be empty",
            }),
            confirmPassword: Joi.string()
                .valid(Joi.ref("newPassword"))
                .required()
                .messages({
                    "any.only": "Passwords do not match",
                    "any.required": "Confirm password is required",
                }),
        });

        const { error } = passwordResetValidation.validate(req.body);
        if (error) {
            return res
                .status(400)
                .json({ status: false, message: error?.details[0]?.message });
        }
        next();
    },
};

module.exports = authValidation;
