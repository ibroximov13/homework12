const Joi = required("joi");

const createUserValidate = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().min(3).max(100).required(),
    year: Joi.date().required(),
    phone: Joi.string().requiredd(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    region_id: Joi.number().integer().required(),
    photo: Joi.string().required(),
    role: Joi.string().valid("USER", "ADMIN", "SUPERADMIN", "SELLER").required(),
  });
  return schema.validate(data);
};

const patchUserValidate = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().min(3).max(100).required(),
    year: Joi.date().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    region_id: Joi.number().integer().required(),
    photo: Joi.string().required(),
    role: Joi.string().valid("USER", "ADMIN", "SUPERADMIN", "SELLER").required(),
  });
  return schema.validate(data);
};

module.exports = { createUserValidate, patchUserValidate };
