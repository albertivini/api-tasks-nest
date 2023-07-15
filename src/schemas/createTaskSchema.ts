import Joi from 'joi';

export const createTaskSchema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
  endDate: Joi.string().required(),
  status: Joi.string().required(),
});
