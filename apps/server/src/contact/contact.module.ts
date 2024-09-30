import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { PrismaService } from 'src/lib';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ContactController],
  providers: [ContactService, PrismaService, JwtService],
})
export class ContactModule {}
