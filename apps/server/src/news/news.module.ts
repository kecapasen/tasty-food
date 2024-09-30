import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { PrismaService, SupabaseService } from 'src/lib';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [NewsController],
  providers: [NewsService, PrismaService, SupabaseService, JwtService],
})
export class NewsModule {}
