import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { PrismaService, SupabaseService } from 'src/lib';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [MenuController],
  providers: [MenuService, PrismaService, SupabaseService, JwtService],
})
export class MenuModule {}
