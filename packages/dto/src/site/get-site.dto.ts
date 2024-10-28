import { IsEmail, IsString } from "class-validator";

export class GetSiteDTO {
  @IsString()
  public readonly aboutUs!: string;
  @IsString()
  public readonly vision!: string;
  @IsString()
  public readonly mision!: string;
  @IsEmail()
  public readonly email!: string;
  @IsString()
  public readonly contact!: string;
  @IsString()
  public readonly location!: string;
}
