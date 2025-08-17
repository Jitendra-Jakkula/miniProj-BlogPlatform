const Joi = require("joi");

const postSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(150)
    .required()
    .messages({
      "string.empty": "Title is required",
      "string.min": "Title must be at least 3 characters",
      "string.max": "Title cannot exceed 150 characters",
    }),
  content: Joi.string()
    .min(10)
    .required()
    .messages({
      "string.empty": "Content is required",
      "string.min": "Content must be at least 10 characters",
    }),
  category: Joi.string().optional().allow(null, ""),
  tags: Joi.array()
    .items(Joi.string().min(1))
    .optional(),
  isPublished: Joi.boolean().optional(),
  // coverImage handled separately (via multer), no need to validate here
});

module.exports = { postSchema };
