import { Type } from "@repo/db";
import { IsEnum } from "class-validator";

export class CreateGalleryDTO {
  @IsEnum(Type)
  public readonly type!: Type;
}
