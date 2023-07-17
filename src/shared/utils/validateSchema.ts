import Joi from 'joi';

export function validateSchema<T>(
  bodyToValidate: unknown,
  schema: Joi.ObjectSchema,
) {
  const body = schema.validate(bodyToValidate);

  if (body.error) throw new Error(body.error.message);

  return body.value as T;
}
