import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from 'src/lib';
import { JwtService } from '@nestjs/jwt';
import { OrderGateway } from './order.gateway';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, JwtService, OrderGateway],
})
export class OrderModule {}
