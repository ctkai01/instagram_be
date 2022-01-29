import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // next.handle() is an Observable of the controller's result value
    return next.handle().pipe(
      catchError((error) => {
        console.log(error);
        throw error;

        // if (error instanceof EntityNotFoundError) {
        //   throw new NotFoundException(error.message);
        // } else {
        //   throw error;
        // }
      }),
    );
  }
}
