import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StaffOnly } from 'src/auth/auth.decorator';
import { Role } from '@repo/db';
import { ResponseDTO } from '@repo/dto';
import { GetCartDTO, CreateCartDTO, UpdateCartDTO } from '@repo/dto';
import { User } from 'src/auth/user.decorator';

@UseGuards(JwtAuthGuard)
@StaffOnly(Role.WAITER)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  public async getCartByUserId(
    @User('userId', ParseIntPipe) userId: number,
  ): Promise<ResponseDTO & { data?: GetCartDTO }> {
    return await this.cartService.getCartByUserId(userId);
  }
  @Post()
  public async addItemToCart(
    @User('userId', ParseIntPipe) userId: number,
    @Body() createCartDTO: CreateCartDTO,
  ): Promise<ResponseDTO> {
    return await this.cartService.addItemToCart(userId, createCartDTO);
  }
  @Patch(':cartDetailId')
  public async updateCartItemQuantity(
    @User('userId', ParseIntPipe) userId: number,
    @Param('cartDetailId', ParseIntPipe) cartDetailId: number,
    @Body() updateCartDTO: UpdateCartDTO,
  ): Promise<ResponseDTO> {
    return await this.cartService.updateCartItemQuantity(
      userId,
      cartDetailId,
      updateCartDTO,
    );
  }
  @Delete()
  public async clearCart(
    @User('userId', ParseIntPipe) userId: number,
  ): Promise<ResponseDTO> {
    return await this.cartService.clearCart(userId);
  }
}
