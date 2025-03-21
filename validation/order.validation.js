const Joi = require("joi");

const OrderValidation = Joi.object({
    user_id: Joi.number().integer().optional(),
});

module.exports = OrderValidation