import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(
      map(({ statusCode, message, data }) => ({
        statusCode:
          statusCode || context.switchToHttp().getResponse().statusCode,
        message: message,
        data: instanceToPlain(data),
      })),
    );
  }
}
