import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Response, Request } from 'express';

@Catch(HttpException, WsException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException | WsException, host: ArgumentsHost) {
    const contextType = host.getType();

    if (contextType === 'http' && exception instanceof HttpException) {
      this.handleHttpException(exception, host);
    } else if (contextType === 'ws' && exception instanceof WsException) {
      this.handleWsException(exception, host);
    }
  }

  private handleHttpException(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const message = exception.message || 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }

  private handleWsException(exception: WsException, host: ArgumentsHost) {
    const wsContext = host.switchToWs();
    const client = wsContext.getClient();

    const message = exception.message || 'WebSocket error';
    const event = 'error';

    client.emit(event, { status: 'error', message });
  }
}
