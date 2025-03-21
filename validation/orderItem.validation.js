const Joi = require("joi");

const OrderItemValidationCreate = Joi.object({
    product_id: Joi.number().integer().required(),
    count: Joi.number().integer().required(),
});


module.exports = { OrderItemValidationCreate}