import { IsString, IsEnum, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { Category } from "@repo/db";

export class UpdateMenuDTO {
  @IsString()
  public readonly name!: string;
  @IsString()
  public readonly description!: string;
  @IsNumber()
  @Type(() => Number)
  public readonly price!: number;
  @IsEnum(Category)
  public readonly category!: Category;
}
