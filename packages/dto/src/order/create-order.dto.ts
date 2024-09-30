import { IsNumber, IsEnum, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Method } from "@repo/db";

export class CreateOrderDetailDTO {
  @IsNumber()
  public readonly menuId!: number;
  @IsNumber()
  public readonly price!: number;
  @IsNumber()
  public readonly quantity!: number;
  @IsNumber()
  public readonly total!: number;
}

export class CreateOrderDTO {
  @IsEnum(Method)
  public readonly method!: Method;
  @IsNumber()
  public readonly total!: number;
  @ValidateNested()
  @Type(() => CreateOrderDetailDTO)
  public readonly orderDetail!: CreateOrderDetailDTO[];
}
