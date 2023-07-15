import Joi from 'joi';

export const createUserSchema = Joi.object().keys({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
