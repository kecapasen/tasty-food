import { IsString, IsEmail, IsDate, IsNumber } from "class-validator";

export class GetContactDTO {
  @IsNumber()
  public readonly id!: number;
  @IsString()
  public readonly subject!: string;
  @IsString()
  public readonly name!: string;
  @IsEmail()
  public readonly email!: string;
  @IsString()
  public readonly message!: string;
  @IsDate()
  public readonly createdAt!: Date;
}
