import { Status } from "@repo/db";
import { IsEnum } from "class-validator";

export class UpdateOrderDTO {
  @IsEnum(Status)
  public readonly status!: Status;
}
