import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/lib';

@Module({
  controllers: [CartController],
  providers: [CartService, PrismaService, JwtService],
})
export class CartModule {}
