const Joi = require("joi");

const userValidation = {
    update: async (req, res, next) => {
        const updateProfileSchema = Joi.object({
            profilePicture: Joi.alternatives()
                .try(Joi.string().allow("", null), Joi.object().instance(File))
                .optional()
                .messages({
                    "alternatives.types": `"Profile Picture" must be either a string or a file object.`,
                }),
            f_name: Joi.string().min(1).max(50).required().messages({
                "string.base": `"First Name" should be of type 'text'.`,
                "string.empty": `"First Name" cannot be empty.`,
                "string.min": `"First Name" should have a minimum length of 1.`,
                "string.max": `"First Name" should have a maximum length of 50.`,
                "any.required": `"First Name" is a required field.`,
            }),
            l_name: Joi.string().min(1).max(50).required().messages({
                "string.base": `"Last Name" should be of type 'text'.`,
                "string.empty": `"Last Name" cannot be empty.`,
                "string.min": `"Last Name" should have a minimum length of 1.`,
                "string.max": `"Last Name" should have a maximum length of 50.`,
                "any.required": `"Last Name" is a required field.`,
            }),
            gender: Joi.string().valid("male", "female", "other").messages({
                "string.base": `"Gender" should be of type 'text'.`,
                "any.only": `"Gender" should be either 'male', 'female', or 'other'.`,
            }),
            mobile: Joi.string()
                .pattern(new RegExp("^[0-9]{10,15}$"))
                .required()
                .messages({
                    "string.pattern.base": `"Mobile" should be a valid phone number with 10 to 15 digits.`,
                    "string.empty": `"Mobile" cannot be empty.`,
                    "any.required": `"Mobile" is a required field.`,
                }),
            education_level: Joi.string()
                .min(1)
                .max(100)
                .optional()
                .allow("", null)
                .messages({
                    "string.base": `"Education Level" should be of type 'text'.`,
                    "string.min": `"Education Level" should have a minimum length of 1.`,
                    "string.max": `"Education Level" should have a maximum length of 100.`,
                }),
            institution: Joi.string()
                .min(1)
                .max(250)
                .optional()
                .allow("", null)
                .messages({
                    "string.base": `"Institution" should be of type 'text'.`,
                    "string.min": `"Institution" should have a minimum length of 1.`,
                    "string.max": `"Institution" should have a maximum length of 100.`,
                }),
        });

        const { error } = updateProfileSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            const messages = error.details
                .map((detail) => detail.message)
                .join(", ");
            return res.status(400).json({ message: messages });
        }
        next();
    },

    addNeeds: async (req, res, next) => {
        const studyNeedSchema = Joi.object({
            name: Joi.string().required().messages({
                "string.base": `"name" should be a type of 'text'.`,
                "string.empty": `"name" cannot be empty.`,
                "any.required": `"name" is a required field.`,
            }),
            timeNeeded: Joi.number().integer().min(1).required().messages({
                "number.base": `"timeNeeded" should be a number.`,
                "number.integer": `"timeNeeded" should be an integer.`,
                "number.min": `"timeNeeded" must be at least 1.`,
                "any.required": `"timeNeeded" is a required field.`,
            }),
            priority: Joi.string()
                .valid("high", "medium", "low")
                .required()
                .messages({
                    "string.base": `"priority" should be a type of 'text'.`,
                    "any.only": `"priority" must be one of the following values: high, medium, low.`,
                    "any.required": `"priority" is a required field.`,
                }),
        });

        const payloadSchema = Joi.object({
            needs: Joi.array()
                .items(studyNeedSchema)
                .required()
                .min(1)
                .messages({
                    "array.base": `"needs" should be an array.`,
                    "array.min": `"needs" must contain at least 1 item.`,
                    "any.required": `"needs" is a required field.`,
                }),
        });

        const { error } = payloadSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: "error",
                message: error.details
                    .map((detail) => detail.message)
                    .join(", "),
            });
        }
        next();
    },
};

module.exports = userValidation;
