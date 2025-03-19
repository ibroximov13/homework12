const Joi = require("joi");

const OrderItemValidationCreate = Joi.object({
    order_id: Joi.number().integer().required(),
    product_id: Joi.number().integer().required(),
    count: Joi.number().integer().required(),
});

const OrderItemPatchValidation = Joi.object({
    order_id: Joi.number().integer().optional(),
    product_id: Joi.number().integer().optional(),
    count: Joi.number().integer().optional(),
});

module.exports = { OrderItemValidationCreate, OrderItemPatchValidation}