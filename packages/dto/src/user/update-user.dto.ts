import { Role } from "@repo/db";
import { IsString, IsEnum } from "class-validator";

export class UpdateUserDTO {
  @IsString()
  public readonly fullname!: string;
  @IsEnum(Role)
  public readonly role!: Role;
  @IsString()
  public readonly password!: string;
}
