import {
  IsInt,
  IsString,
  IsDate,
  IsUrl,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { Prisma } from "@repo/db";

class GetUserDTO {
  @IsString()
  public readonly fullname!: string;
  @IsOptional()
  @IsUrl()
  public readonly avatar!: string | null;
}

export class GetNewsDTO {
  @IsInt()
  public readonly id!: number;
  @IsString()
  public readonly title!: string;
  public readonly article!: Prisma.JsonValue;
  @IsUrl()
  public readonly headerImage!: string;
  @ValidateNested()
  @Type(() => GetUserDTO)
  public readonly user!: GetUserDTO;
  @IsDate()
  public readonly createdAt!: Date;
  @IsOptional()
  @IsDate()
  public readonly updatedAt!: Date | null;
}
