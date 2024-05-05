import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url } = request;
    const userAgent = request.get('user-agent') || '';
    const realIP = process.env.NODE_ENV === 'development' ? ip : request.get('X-Real-IP');

    response.on('close', () => {
      const { statusCode } = response;
      //   const contentLength = response.get('content-length');
      this.logger.log(`${method} ${url} ${statusCode} - ${userAgent} ${realIP}`);
    });
    next();
  }
}
