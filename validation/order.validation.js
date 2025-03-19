const Joi = require("joi");

const OrderValidation = Joi.object({
    user_id: Joi.number().integer().required(),
});

module.exports = OrderValidation