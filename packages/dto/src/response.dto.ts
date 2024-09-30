import { IsNumber, IsString } from "class-validator";

export class ResponseDTO {
  @IsString() public readonly message!: string;
  @IsNumber() public readonly statusCode!: number;
}
