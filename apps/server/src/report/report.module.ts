import { Module } from '@nestjs/common';
import { ReportGateway } from './report.gateway';
import { ReportService } from './report.service';
import { PrismaService } from 'src/lib';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [ReportGateway, ReportService, PrismaService, JwtService],
})
export class ReportModule {}
