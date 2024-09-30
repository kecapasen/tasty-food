import { Injectable } from '@nestjs/common';
import {
  DateRangeDTO,
  GetDashboardDTO,
  GetReportDTO,
  ResponseDTO,
} from '@repo/dto';
import {
  endOfDay,
  format,
  getHours,
  setHours,
  startOfDay,
  startOfHour,
  subDays,
} from 'date-fns';
import { PrismaService } from 'src/lib';

@Injectable()
export class ReportService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getDataDashboard(): Promise<
    ResponseDTO & { data?: GetDashboardDTO }
  > {
    try {
      const topSellingItems = await this.prismaService.orderDetail.groupBy({
        by: ['menuId'],
        _sum: {
          quantity: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: 1,
      });
      const salesByHourToday = await this.prismaService.order.groupBy({
        by: ['createdAt'],
        _sum: {
          total: true,
        },
        where: {
          createdAt: {
            gte: setHours(startOfDay(new Date()), 8),
            lt: setHours(endOfDay(new Date()), 21),
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
      const salesByHourYesterday = await this.prismaService.order.groupBy({
        by: ['createdAt'],
        _sum: {
          total: true,
        },
        where: {
          createdAt: {
            gte: setHours(startOfDay(subDays(new Date(), 1)), 8),
            lt: setHours(endOfDay(subDays(new Date(), 1)), 21),
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
      const bestSellingItem = await this.prismaService.menu.findUnique({
        where: {
          id: topSellingItems[0]?.menuId || 0,
        },
      });
      const orderData = await this.prismaService.order.findMany({
        include: {
          _count: true,
          orderDetail: true,
        },
        where: {
          createdAt: {
            gte: setHours(startOfDay(new Date()), 8),
            lt: setHours(endOfDay(new Date()), 21),
          },
        },
      });
      const totalRevenue = orderData.reduce((acc, order) => {
        return acc + (order.total || 0);
      }, 0);
      const salesByHour = Array.from({ length: 21 - 8 + 1 }, (_, i) => {
        const hour = 8 + i;
        const todayTotal =
          salesByHourToday.find((item) => getHours(item.createdAt) === hour)
            ?._sum?.total || 0;
        const yesterdayTotal =
          salesByHourYesterday.find((item) => getHours(item.createdAt) === hour)
            ?._sum?.total || 0;
        return {
          hour: format(startOfHour(new Date()).setHours(hour), 'HH:mm'),
          today: todayTotal,
          yesterday: yesterdayTotal,
        };
      });
      const responseData: GetDashboardDTO = {
        totalOrders: orderData.length,
        totalRevenue: totalRevenue,
        totalPendingOrders: orderData.filter(
          (item) => item.status === 'PENDING',
        ).length,
        topSellingItem: bestSellingItem?.name || 'Tidak ada data',
        salesByHourData: salesByHour,
        orders: orderData.map((item, _) => {
          return {
            id: item.id,
            totalAmount: item.total,
            orderStatus: item.status,
            createdAt: item.createdAt,
          };
        }),
      };
      return {
        message: 'Data berhasil diambil',
        statusCode: 200,
        data: responseData,
      };
    } catch (error: any) {
      return { message: error.message, statusCode: 500 };
    }
  }
  async getReportData(
    dateRangeDTO: DateRangeDTO,
  ): Promise<ResponseDTO & { data?: GetReportDTO }> {
    const revenueData = await this.prismaService.order.groupBy({
      by: ['createdAt'],
      _sum: {
        total: true,
      },
      where: {
        createdAt: {
          gte: startOfDay(dateRangeDTO.startDate),
          lt: endOfDay(dateRangeDTO.endDate),
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    const revenueChartData = revenueData.map((order) => ({
      date: format(order.createdAt, 'yyyy-MM-dd'),
      revenueAmount: order._sum?.total || 0,
    }));
    const topSellingItems = await this.prismaService.orderDetail.groupBy({
      by: ['menuId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 4,
    });
    const topSellingItemsChartData = await Promise.all(
      topSellingItems.map(async (item) => {
        const menu = await this.prismaService.menu.findUnique({
          where: { id: item.menuId },
        });
        return {
          menu: menu?.name || 'Tidak diketahui',
          total: item._sum?.quantity || 0,
          fill: `var(--color-${menu?.name?.toLowerCase() || 'unknown'})`,
        };
      }),
    );
    const responseData: GetReportDTO = {
      revenueChartData,
      topSellingItemsChartData,
    };
    return {
      message: 'Report data berhasil diambil',
      statusCode: 200,
      data: responseData,
    };
  }
}