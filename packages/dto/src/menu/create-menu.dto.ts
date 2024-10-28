import { Category } from "@repo/db";
import { IsString, IsEnum, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class CreateMenuDTO {
  @IsString()
  public readonly name!: string;
  @IsString()
  public readonly description!: string;
  @Type(() => Number)
  @IsNumber()
  public readonly price!: number;
  @IsEnum(Category)
  public readonly category!: Category;
}
