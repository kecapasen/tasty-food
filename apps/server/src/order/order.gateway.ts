import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { OrderService } from './order.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StaffOnly } from 'src/auth/auth.decorator';
import { Role } from '@repo/db';
import { GetOrderDTO, ResponseDTO } from '@repo/dto';

@WebSocketGateway({ cors: '*' })
export class OrderGateway {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.ADMIN)
  @SubscribeMessage('createOrder')
  async handleMessage(): Promise<
    WsResponse<ResponseDTO & { data?: GetOrderDTO[] }>
  > {
    const data = await this.orderService.getAllOrders();
    return {
      event: 'updateOrder',
      data,
    };
  }
}
