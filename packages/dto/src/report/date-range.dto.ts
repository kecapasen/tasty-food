import { IsDateString } from "class-validator";

export class DateRangeDTO {
  @IsDateString()
  public readonly startDate!: string;
  @IsDateString()
  public readonly endDate!: string;
}
