const Joi = require("joi");

const CommentValidationCreate = Joi.object({
    user_id: Joi.number().integer().required(),
    product_id: Joi.number().integer().required(),
    message: Joi.string().min(2).required(),
    star: Joi.number().integer().required(),
});

const CommentPatchValidation = Joi.object({
    user_id: Joi.number().integer().optional(),
    product_id: Joi.number().integer().optional(),
    message: Joi.string().min(2).optional(),
    star: Joi.number().integer().optional(),
});

module.exports = { CommentValidationCreate, CommentPatchValidation}