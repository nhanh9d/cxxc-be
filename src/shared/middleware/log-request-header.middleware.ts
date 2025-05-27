import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LogRequestHeaderMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LogRequestHeaderMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`Request Headers: ${JSON.stringify(req.headers)}`);
    next();
  }
} 