import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetClientIp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return (
      request.ip ||
      request.connection.remoteAddress ||
      request.headers['x-forwarded-for']
    );
  },
);
