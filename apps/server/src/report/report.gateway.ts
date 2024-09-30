import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { ReportService } from './report.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StaffOnly } from 'src/auth/auth.decorator';
import { Role } from '@repo/db';
import {
  DateRangeDTO,
  GetDashboardDTO,
  GetReportDTO,
  ResponseDTO,
} from '@repo/dto';

@WebSocketGateway()
export class ReportGateway {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.ADMIN)
  @SubscribeMessage('getDataDashboard')
  async updateDashboard(): Promise<
    WsResponse<ResponseDTO & { data?: GetDashboardDTO }>
  > {
    const data = await this.reportService.getDataDashboard();
    return {
      event: 'updateDashboard',
      data,
    };
  }
  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.ADMIN)
  @SubscribeMessage('getDataReport')
  async updateReport(
    @MessageBody() dateRangeDTO: DateRangeDTO,
  ): Promise<WsResponse<ResponseDTO & { data?: GetReportDTO }>> {
    const data = await this.reportService.getReportData(dateRangeDTO);
    return {
      event: 'updateReport',
      data,
    };
  }
}
