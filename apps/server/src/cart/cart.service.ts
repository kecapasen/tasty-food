import { Injectable, NotFoundException } from '@nestjs/common';
import { CartDetail, Menu } from '@repo/db';
import {
  CreateCartDTO,
  GetCartDetailDTO,
  GetCartDTO,
  ResponseDTO,
  UpdateCartDTO,
} from '@repo/dto';
import { PrismaService } from 'src/lib';

interface ICartDetailWithMenu extends CartDetail {
  menu: Menu;
}

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getCartByUserId(userId: number): Promise<
    ResponseDTO & {
      data?: GetCartDTO;
    }
  > {
    const cart = await this.prismaService.cart.findUnique({
      where: { userId },
      include: {
        cartDetail: {
          include: { menu: true },
        },
      },
    });
    if (!cart) throw new NotFoundException('Keranjang tidak ditemukan');
    const cartData: GetCartDTO = {
      cartDetail: cart.cartDetail.map(
        (detail: ICartDetailWithMenu, _: number): GetCartDetailDTO => {
          return {
            id: detail.id,
            price: detail.price,
            quantity: detail.quantity,
            total: detail.total,
            menu: {
              id: detail.menu.id,
              name: detail.menu.name,
              category: detail.menu.category,
              image: detail.menu.image,
            },
          };
        },
      ),
    };
    return {
      message: 'Keranjang berhasil diambil',
      statusCode: 200,
      data: cartData,
    };
  }
  public async addItemToCart(
    userId: number,
    createCartDTO: CreateCartDTO,
  ): Promise<ResponseDTO> {
    const cart = await this.prismaService.cart.findUnique({
      where: { userId },
    });
    if (!cart) throw new NotFoundException('Keranjang tidak ditemukan');
    await this.prismaService.cartDetail.create({
      data: {
        price: createCartDTO.cartDetail.price,
        quantity: createCartDTO.cartDetail.quantity,
        total:
          createCartDTO.cartDetail.price * createCartDTO.cartDetail.quantity,
        cart: { connect: { id: cart.id } },
        menu: { connect: { id: createCartDTO.cartDetail.menuId } },
      },
    });
    return {
      message: 'Item berhasil ditambahkan ke keranjang',
      statusCode: 201,
    };
  }
  public async updateCartItemQuantity(
    userId: number,
    cartDetailId: number,
    updateCartDTO: UpdateCartDTO,
  ): Promise<ResponseDTO> {
    const cart = await this.prismaService.cart.findUnique({
      where: { userId, cartDetail: { some: { id: { equals: cartDetailId } } } },
    });
    if (!cart) throw new NotFoundException('Keranjang tidak ditemukan');
    if (updateCartDTO.quantity === 0) {
      await this.prismaService.cartDetail.delete({
        where: { id: cartDetailId },
      });
    } else {
      await this.prismaService.cartDetail.update({
        where: { id: cartDetailId },
        data: {
          quantity: updateCartDTO.quantity,
        },
      });
    }
    return { message: 'Item keranjang berhasil diperbarui', statusCode: 200 };
  }
  public async clearCart(userId: number): Promise<ResponseDTO> {
    const cart = await this.prismaService.cart.findUnique({
      where: { userId },
    });
    if (!cart) throw new NotFoundException('Keranjang tidak ditemukan');
    await this.prismaService.cartDetail.deleteMany({
      where: { cartId: cart.id },
    });
    return { message: 'Keranjang berhasil dikosongkan', statusCode: 200 };
  }
}
