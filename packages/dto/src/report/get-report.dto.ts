import {
  IsNumber,
  IsString,
  IsEnum,
  IsDate,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { Status } from "@repo/db";

export class GetSalesByHourDTO {
  @IsString()
  public readonly hour!: string;
  @IsNumber()
  public readonly today!: number;
  @IsNumber()
  public readonly yesterday!: number;
}

export class GetOrderReportDTO {
  @IsNumber()
  public readonly id!: number;
  @IsNumber()
  public readonly totalAmount!: number;
  @IsEnum(Status)
  public readonly orderStatus!: Status;
  @IsDate()
  public readonly createdAt!: Date;
}

export class GetRevenueChartDataDTO {
  @IsString()
  public readonly date!: string;
  @IsNumber()
  public readonly revenueAmount!: number;
}

export class GetTopSellingItemDTO {
  @IsString()
  public readonly menu!: string;
  @IsNumber()
  public readonly total!: number;
  @IsString()
  public readonly fill!: string;
}

export class GetDashboardDTO {
  @IsNumber()
  public readonly totalOrders!: number;
  @IsNumber()
  public readonly totalRevenue!: number;
  @IsNumber()
  public readonly totalPendingOrders!: number;
  @IsString()
  public readonly topSellingItem!: string;
  @ValidateNested()
  @IsArray()
  @Type(() => GetSalesByHourDTO)
  public readonly salesByHourData!: GetSalesByHourDTO[];
  @ValidateNested()
  @IsArray()
  @Type(() => GetOrderReportDTO)
  public readonly orders!: GetOrderReportDTO[];
}

export class GetReportDTO {
  @ValidateNested()
  @IsArray()
  @Type(() => GetRevenueChartDataDTO)
  public readonly revenueChartData!: GetRevenueChartDataDTO[];
  @ValidateNested()
  @IsArray()
  @Type(() => GetTopSellingItemDTO)
  public readonly topSellingItemsChartData!: GetTopSellingItemDTO[];
}
