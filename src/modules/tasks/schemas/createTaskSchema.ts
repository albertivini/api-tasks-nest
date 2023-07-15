import Joi from 'joi';
import { STATUS } from '../../../shared/constants/status';

// yyyy-mm-dd or dd/mm/yyyy
const dateRegex =
  /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$|^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;

export const createTaskSchema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
  endDate: Joi.string().regex(dateRegex).required(),
  status: Joi.string()
    .valid(STATUS.DOING, STATUS.DONE, STATUS.PENDING)
    .required(),
});
