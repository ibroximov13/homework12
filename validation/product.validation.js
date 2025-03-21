const Joi = require("joi");

const ProductValidationCreate = Joi.object({
    author_id: Joi.number().integer().required(),
    name: Joi.string().min(2).max(50).required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    category_id: Joi.number().integer().required(),
    price: Joi.number().integer().required(),
    // star: Joi.number().precision(2).required(),
    // comment: Joi.string().required(),
});

const ProductPatchValidation = Joi.object({
    author_id: Joi.number().integer().optional(),
    name: Joi.string().min(2).max(50).optional(),
    image: Joi.string().optional(),
    description: Joi.string().optional(),
    category_id: Joi.number().integer().optional(),
    price: Joi.number().integer().optional(),
    // star: Joi.number().precision(2).optional(),
    // comment: Joi.string().optional(),
});

module.exports = { ProductValidationCreate, ProductPatchValidation}