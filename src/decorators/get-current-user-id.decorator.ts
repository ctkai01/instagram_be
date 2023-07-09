import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (data: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    // return request.user['sub'];
    if (request.user['refreshToken']) {
      return request.user['sub'];
    }
    return request.user['sub'];
  },
);
