import { HttpException, HttpStatus } from '@nestjs/common';
import Joi from 'joi';

export function validateSchema<T>(
  bodyToValidate: unknown,
  schema: Joi.ObjectSchema,
) {
  const body = schema.validate(bodyToValidate);

  if (body.error)
    throw new HttpException(
      {
        error: body.error.message,
      },
      HttpStatus.BAD_REQUEST,
    );

  return body as T;
}
