import { IsNumber } from "class-validator";

export class UpdateCartDTO {
  @IsNumber()
  public readonly quantity!: number;
}
