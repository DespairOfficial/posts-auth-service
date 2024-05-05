import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CustomHeaders = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req: Request = ctx.switchToHttp().getRequest();

  // CAREFUL: Backend is inside of docker container. Hence use X-Real-IP instead of request.ip

  const ip = process.env.NODE_ENV === 'development' ? req.ip : req.get('X-Real-IP');
  return {
    userAgent: req.headers['user-agent'],
    fingerprint: req.headers['fingerprint'],
    ip,
  };
  // return data ? req.headers.data : req.headers;
});
