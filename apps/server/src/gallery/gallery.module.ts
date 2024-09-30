import { Module } from '@nestjs/common';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { PrismaService, SupabaseService } from 'src/lib';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [GalleryController],
  providers: [GalleryService, PrismaService, SupabaseService, JwtService],
})
export class GalleryModule {}
