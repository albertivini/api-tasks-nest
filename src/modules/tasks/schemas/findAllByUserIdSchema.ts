import Joi from 'joi';
import { STATUS } from '../../../shared/constants/status';

export const findAllByUserIdSchema = Joi.object().keys({
  status: Joi.string()
    .valid(STATUS.PENDING, STATUS.DOING, STATUS.DONE)
    .optional(),
});
