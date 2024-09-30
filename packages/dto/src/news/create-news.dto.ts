import { Prisma } from "@repo/db";
import { IsString } from "class-validator";

export class CreateNewsDTO {
  @IsString()
  public readonly title!: string;
  public readonly article!: Prisma.InputJsonValue;
}
