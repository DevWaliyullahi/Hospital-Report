
import Joi from 'joi';

export const createReportValidation = Joi.object({
  patientId: Joi.string().required(),
  patientName: Joi.string().required(),
  age: Joi.string().required(),
  hospitalName: Joi.string().required(),
  weight: Joi.string().required(),
  height: Joi.string().required(),
  bloodGroup: Joi.string().required(),
  genotype: Joi.string().required(),
  bloodPressure: Joi.string().required(),
  HIV_status: Joi.string().required(),
  hepatitis: Joi.string().required(),
});
