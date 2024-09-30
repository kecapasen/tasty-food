import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch(HttpException, WsException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException | WsException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const wsContext = host.switchToWs();
    const client = wsContext.getClient();
    if (host.getType() === 'http') {
      const status =
        exception instanceof HttpException ? exception.getStatus() : 500;
      const message = exception.message || 'Internal server error';
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: message,
      });
    } else if (host.getType() === 'ws') {
      const message =
        exception instanceof WsException
          ? exception.message
          : 'WebSocket error';
      const event = 'error';
      client.emit(event, { status: 'error', message });
    }
  }
}
