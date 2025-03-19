const Joi = require("joi");

const CategoryValidationCreate = Joi.object({
    name: Joi.string().min(2).max(40).required(),
    photo: Joi.string().required()
});

const CategoryPatchValidation = Joi.object({
    name: Joi.string().min(2).max(40).optional(),
    photo: Joi.string().optional()
});

module.exports = { CategoryValidationCreate, CategoryPatchValidation}