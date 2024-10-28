import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { OrderService } from './order.service';
import { GetOrderDTO, ResponseDTO } from '@repo/dto';
import { Server } from 'socket.io';

@WebSocketGateway(8080, {
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class OrderGateway {
  constructor(private readonly orderService: OrderService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('getOrder')
  async handleMessage(): Promise<void> {
    const data = await this.orderService.getAllOrders();
    this.server.emit('updateOrder', data);
  }
}
