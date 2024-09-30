import { Role } from "@repo/db";
import { IsNumber, IsString, IsEnum } from "class-validator";

export class UpdateUserDTO {
  @IsNumber()
  public readonly userId!: number;
  @IsString()
  public readonly fullname!: string;
  @IsEnum(Role)
  public readonly role!: Role;
  @IsString()
  public readonly password!: string;
}
