import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ReportService } from './report.service';
import { DateRangeDTO } from '@repo/dto';
import { Server } from 'socket.io';

@WebSocketGateway(8080, {
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ReportGateway {
  constructor(private readonly reportService: ReportService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('getDataDashboard')
  async updateDashboard(): Promise<void> {
    const data = await this.reportService.getDataDashboard();
    this.server.emit('updateDashboard', data);
  }

  @SubscribeMessage('getDataReport')
  async updateReport(@MessageBody() dateRangeDTO: DateRangeDTO): Promise<void> {
    const data = await this.reportService.getReportData(dateRangeDTO);
    this.server.emit('updateReport', data);
  }
}
