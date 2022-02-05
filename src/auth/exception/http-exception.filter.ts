import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionValidateFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const message =
      exception.getResponse()['message'].length > 1
        ? exception.getResponse()['message']
        : exception.getResponse()['message'][0];

    if (status === HttpStatus.UNAUTHORIZED) {
      response.status(status).json({
        statusCode: status,
        message: message,
      });
    }
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      response.status(status).json({
        statusCode: status,
        message: message,
      });
    }

    if (status === HttpStatus.NOT_FOUND) {
      response.status(status).json({
        statusCode: status,
        message: message,
      });
    }

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      message: message,
    });
  }
}
