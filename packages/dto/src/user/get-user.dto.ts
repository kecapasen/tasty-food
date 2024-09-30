import { Role } from "@repo/db";
import { IsNumber, IsString, IsEnum, IsUrl, IsOptional } from "class-validator";

export class GetUserDTO {
  @IsNumber()
  public readonly userId!: number;
  @IsString()
  public readonly fullname!: string;
  @IsString()
  public readonly password!: string;
  @IsEnum(Role)
  public readonly role!: Role;
  @IsOptional()
  @IsUrl()
  public readonly avatar!: string | null;
}
