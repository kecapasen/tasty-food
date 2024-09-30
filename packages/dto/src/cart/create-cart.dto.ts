import { IsNumber, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class CreateCartDetailDTO {
  @IsNumber()
  public readonly menuId!: number;
  @IsOptional()
  @IsNumber()
  public readonly quantity!: number;
  @IsNumber()
  public readonly price!: number;
}

export class CreateCartDTO {
  @ValidateNested({ each: true })
  @Type(() => CreateCartDetailDTO)
  public readonly cartDetail!: CreateCartDetailDTO;
}
