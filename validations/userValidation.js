const Joi = require("joi");

const signupSchema = Joi.object({
  fname: Joi.string()
    .pattern(/^[a-zA-Z\s]+$/)
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "Full name is required",
      "string.pattern.base": "Full name can only contain letters and spaces",
      "string.min": "Full name must be at least 3 characters",
      "string.max": "Full name must be at most 50 characters",
    }),
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(20)
    .required()
    .messages({
      "string.empty": "Username is required",
      "string.alphanum": "Username can only contain letters and numbers",
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username must be at most 20 characters",
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
    }),
  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base": "Password must be 6-20 characters and include at least one letter and one number",
    }),
  bio: Joi.string()
    .min(10)
    .max(300)
    .required()
    .messages({
      "string.empty": "Bio is required",
      "string.min": "Bio must be at least 10 characters",
      "string.max": "Bio must be at most 300 characters",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email",
    }),
  password: Joi.string()
    .min(6)
    .max(20)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password must not exceed 20 characters",
    }),
});

module.exports = { signupSchema ,loginSchema};
