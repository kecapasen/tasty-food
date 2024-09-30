import {
  IsString,
  IsEnum,
  IsUrl,
  ValidateNested,
  IsArray,
  IsNumber,
} from "class-validator";
import { Type } from "class-transformer";
import { Category } from "@repo/db";

class GetMenuDTO {
  @IsNumber()
  public readonly id!: number;
  @IsString()
  public readonly name!: string;
  @IsEnum(Category)
  public readonly category!: Category;
  @IsUrl()
  public readonly image!: string;
}

export class GetCartDetailDTO {
  @IsNumber()
  public readonly id!: number;
  @ValidateNested()
  @Type(() => GetMenuDTO)
  public readonly menu!: GetMenuDTO;
  @IsNumber()
  public readonly price!: number;
  @IsNumber()
  public readonly quantity!: number;
  @IsNumber()
  public readonly total!: number;
}

export class GetCartDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GetCartDetailDTO)
  public readonly cartDetail!: GetCartDetailDTO[];
}
