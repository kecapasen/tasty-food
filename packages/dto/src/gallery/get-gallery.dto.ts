import {
  IsString,
  IsUrl,
  IsDate,
  ValidateNested,
  IsOptional,
  IsNumber,
} from "class-validator";
import { Type } from "class-transformer";

class GetUserDTO {
  @IsString()
  public readonly fullname!: string;
  @IsOptional()
  @IsUrl()
  public readonly avatar!: string | null;
}

export class GetGalleryDTO {
  @IsNumber()
  public readonly id!: number;
  @IsUrl()
  public readonly image!: string;
  @ValidateNested()
  @Type(() => GetUserDTO)
  public readonly user!: GetUserDTO;
  @IsDate()
  public readonly createdAt!: Date;
  @IsOptional()
  @IsDate()
  public readonly updatedAt!: Date | null;
}
