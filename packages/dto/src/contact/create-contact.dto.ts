import { IsString, IsEmail } from "class-validator";

export class CreateContactDTO {
  @IsString()
  public readonly subject!: string;
  @IsString()
  public readonly name!: string;
  @IsEmail()
  public readonly email!: string;
  @IsString()
  public readonly message!: string;
}
