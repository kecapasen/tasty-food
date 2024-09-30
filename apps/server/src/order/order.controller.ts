import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StaffOnly } from 'src/auth/auth.decorator';
import { Role } from '@repo/db';
import { User } from 'src/auth/user.decorator';
import {
  CreateOrderDTO,
  GetOrderDTO,
  ResponseDTO,
  UpdateOrderDTO,
} from '@repo/dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.ADMIN, Role.CHEF, Role.WAITER)
  @Get()
  public async getAllOrders(): Promise<ResponseDTO & { data?: any }> {
    return await this.orderService.getAllOrders();
  }
  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.ADMIN, Role.CHEF, Role.WAITER)
  @Get(':orderId')
  public async getOrderById(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<ResponseDTO & { data?: GetOrderDTO }> {
    return await this.orderService.getOrderById(orderId);
  }
  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.WAITER)
  @Post()
  public async createOrder(
    @User('userId', ParseIntPipe) userId: number,
    @Body() createOrderDTO: CreateOrderDTO,
  ): Promise<ResponseDTO> {
    return await this.orderService.createOrder(userId, createOrderDTO);
  }
  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.CHEF, Role.WAITER)
  @Patch(':orderId')
  public async updateOrderStatus(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() updateOrderDTO: UpdateOrderDTO,
  ): Promise<ResponseDTO> {
    return await this.orderService.updateOrderStatus(orderId, updateOrderDTO);
  }
}
