import { Injectable, NotFoundException } from '@nestjs/common';
import { Menu, Order, OrderDetail, User } from '@repo/db';
import {
  CreateOrderDTO,
  GetOrderDetailDTO,
  GetOrderDTO,
  ResponseDTO,
  UpdateOrderDTO,
} from '@repo/dto';
import { PrismaService } from 'src/lib';

interface IOrderDetail extends OrderDetail {
  menu: Menu;
}

interface IOrder extends Order {
  user: User;
  orderDetail: IOrderDetail[];
}

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getAllOrders(): Promise<
    ResponseDTO & {
      data?: GetOrderDTO[];
    }
  > {
    const orders = await this.prismaService.order.findMany({
      include: { user: true, orderDetail: { include: { menu: true } } },
    });
    const orderResponses: GetOrderDTO[] = orders.map(
      (order: IOrder): GetOrderDTO => ({
        id: order.id,
        method: order.method,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        user: {
          fullname: order.user.fullname,
          avatar: order.user.avatar,
        },
        orderDetail: order.orderDetail.map(
          (detail: IOrderDetail): GetOrderDetailDTO => ({
            price: detail.price,
            quantity: detail.quantity,
            total: detail.total,
            menu: {
              name: detail.menu.name,
              category: detail.menu.category,
              image: detail.menu.image,
            },
          }),
        ),
      }),
    );
    if (orderResponses.length < 1)
      throw new NotFoundException('Tidak ada pesanan ditemukan');
    return {
      message: 'Pesanan berhasil diambil',
      statusCode: 200,
      data: orderResponses,
    };
  }
  public async getOrderById(orderId: number): Promise<
    ResponseDTO & {
      data?: GetOrderDTO;
    }
  > {
    const order = await this.prismaService.order.findUnique({
      include: { user: true, orderDetail: { include: { menu: true } } },
      where: {
        id: orderId,
      },
    });
    if (!order) throw new NotFoundException('Pesanan tidak ditemukan');
    const orderResponse: GetOrderDTO = {
      id: order.id,
      method: order.method,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      user: {
        fullname: order.user.fullname,
        avatar: order.user.avatar,
      },
      orderDetail: order.orderDetail.map(
        (detail: IOrderDetail): GetOrderDetailDTO => ({
          price: detail.price,
          quantity: detail.quantity,
          total: detail.total,
          menu: {
            name: detail.menu.name,
            category: detail.menu.category,
            image: detail.menu.image,
          },
        }),
      ),
    };
    return {
      message: 'Pesanan berhasil diambil',
      statusCode: 200,
      data: orderResponse,
    };
  }
  public async createOrder(
    userId: number,
    createOrderDTO: CreateOrderDTO,
  ): Promise<ResponseDTO> {
    await this.prismaService.order.create({
      data: {
        ...createOrderDTO,
        orderDetail: {
          createMany: {
            data: createOrderDTO.orderDetail,
          },
        },
        user: { connect: { userId } },
      },
    });
    return { message: 'Pesanan berhasil dibuat', statusCode: 201 };
  }
  public async updateOrderStatus(
    orderId: number,
    updateOrderDTO: UpdateOrderDTO,
  ): Promise<ResponseDTO> {
    const order = await this.prismaService.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Pesanan tidak ditemukan');
    await this.prismaService.order.update({
      where: { id: orderId },
      data: updateOrderDTO,
    });
    return { message: 'Status pesanan berhasil diperbarui', statusCode: 200 };
  }
}
