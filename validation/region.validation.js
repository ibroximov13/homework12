const Joi = require("joi");

const RegionValidation = Joi.object({
    name: Joi.string().min(3).max(40).required(),
});

module.exports = RegionValidation