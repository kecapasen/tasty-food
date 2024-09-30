import { IsString, IsEmail, IsDate } from "class-validator";

export class GetContactDTO {
  @IsString()
  public readonly subject!: string;
  @IsString()
  public readonly name!: string;
  @IsEmail()
  readonly email!: string;
  @IsString()
  public readonly message!: string;
  @IsDate()
  public readonly createdAt!: Date;
}
