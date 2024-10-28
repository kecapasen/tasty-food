import {
  IsNumber,
  IsEnum,
  ValidateNested,
  IsDate,
  IsString,
  IsUrl,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { Category, Status } from "@repo/db";

class GetMenuDTO {
  @IsString()
  public readonly name!: string;
  @IsEnum(Category)
  public readonly category!: Category;
  @IsUrl()
  public readonly image!: string;
}

export class GetOrderDetailDTO {
  @ValidateNested()
  @Type(() => GetMenuDTO)
  public readonly menu!: GetMenuDTO;
  @IsNumber()
  public readonly price!: number;
  @IsNumber()
  public readonly total!: number;
  @IsNumber()
  public readonly quantity!: number;
}

class GetUserDTO {
  @IsString()
  public readonly fullname!: string;
  @IsOptional()
  @IsUrl()
  public readonly avatar!: string | null;
}

export class GetOrderDTO {
  @IsNumber()
  public readonly id!: number;
  @ValidateNested()
  @Type(() => GetOrderDetailDTO)
  public readonly orderDetail!: GetOrderDetailDTO[];
  @ValidateNested()
  @Type(() => GetUserDTO)
  public readonly user!: GetUserDTO;
  @IsNumber()
  public readonly total!: number;
  @IsEnum(Status)
  public readonly status!: Status;
  @IsDate()
  public readonly createdAt!: Date;
}
