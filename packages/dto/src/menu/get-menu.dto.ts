import {
  IsString,
  IsEnum,
  IsOptional,
  IsDate,
  IsUrl,
  ValidateNested,
  IsNumber,
} from "class-validator";
import { Type } from "class-transformer";
import { Category } from "@repo/db";

class GetUserDTO {
  @IsString()
  public readonly fullname!: string;
  @IsOptional()
  @IsUrl()
  public readonly avatar!: string | null;
}

export class GetMenuDTO {
  @IsNumber()
  public readonly id!: number;
  @IsString()
  public readonly name!: string;
  @IsString()
  public readonly description!: string;
  @IsNumber()
  @Type(() => Number)
  public readonly price!: number;
  @IsEnum(Category)
  public readonly category!: Category;
  @IsUrl()
  public readonly image!: string;
  @ValidateNested()
  @IsOptional()
  @Type(() => GetUserDTO)
  public readonly user?: GetUserDTO;
  @IsDate()
  @Type(() => Date)
  public readonly createdAt!: Date;
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  public readonly updatedAt!: Date | null;
}
