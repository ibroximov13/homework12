const Joi = require("joi");

const createUserValidate = (data) => {
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

const patchUserValidate = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().min(3).max(100).required(),
    year: Joi.date().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
    region_id: Joi.number().integer().required(),
    photo: Joi.string().required(),
    role: Joi.string().valid("USER", "ADMIN", "SUPERADMIN", "SELLER").required(),
  });
  return schema.validate(data);
};

const sendOtpValidate = (data) => {
  const schema = Joi.object({
    phone: Joi.string().pattern(/^\+998[0-9]{9}$/).required()
  });
  return schema.validate(data)
};

const verifyOtpValidate = (data) => {
  const schema = Joi.object({
    phone: Joi.string().pattern(/^\+998[0-9]{9}$/).required(),
    otp: Joi.string().max(4).min(4).required()
  });
  return schema.validate(data)
};

const userLoginValidate = (data) => {
  const schema = Joi.object({
    phone: Joi.string().pattern(/^\+998[0-9]{9}$/).required(),
    password: Joi.string().min(6).required()
  });
  return schema.validate(data);
}

const refreshTokenValidate = (data) => {
  const schema = Joi.object({
    token: Joi.string().required()
  });
  return schema.validate(data)
}

module.exports = { createUserValidate, patchUserValidate, sendOtpValidate, verifyOtpValidate, userLoginValidate, refreshTokenValidate };
