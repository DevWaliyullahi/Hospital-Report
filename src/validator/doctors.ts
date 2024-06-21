
import Joi from 'joi';

export const createDoctorValidation = Joi.object({
  doctorsName: Joi.string().required(),
  email: Joi.string().email().required(),
  specializations: Joi.string().required(),
  gender: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().min(6).required(),
  isAdmin: Joi.boolean(),
});


