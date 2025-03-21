const Joi = require("joi");

const orderValidation = Joi.object({
    products: Joi.array().items(
        Joi.object({
            product_id: Joi.number().integer().required(),
            count: Joi.number().integer().min(1).required()
        })
    ).min(1).required()
});

module.exports = orderValidation