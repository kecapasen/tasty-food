import { Category } from "@repo/db";
import { IsString, IsEnum, IsNumber } from "class-validator";

export class CreateMenuDTO {
  @IsString()
  public readonly name!: string;
  @IsString()
  public readonly description!: string;
  @IsNumber()
  public readonly price!: number;
  @IsEnum(Category)
  public readonly category!: Category;
}
