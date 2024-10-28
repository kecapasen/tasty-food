import { Module } from '@nestjs/common';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/lib';

@Module({
  controllers: [SiteController],
  providers: [SiteService, PrismaService, JwtService],
})
export class SiteModule {}
