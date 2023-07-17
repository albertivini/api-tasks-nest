import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { Payload } from './interfaces/Payload';
import { TOKEN_SECRET } from '../shared/constants/tokenSecret';
import { ERROR_MESSAGES } from '../shared/constants/errorMessages';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;

    if (!authToken) {
      return res.status(401).json({ message: ERROR_MESSAGES.INVALID_TOKEN });
    }

    const [, token] = authToken.split(' ');

    try {
      const { sub } = verify(token, TOKEN_SECRET) as Payload;

      req.userId = sub;

      return next();
    } catch (err) {
      return res.status(401).json({ message: ERROR_MESSAGES.INVALID_TOKEN });
    }
  }
}
