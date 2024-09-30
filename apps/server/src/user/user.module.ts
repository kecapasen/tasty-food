import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService, SupabaseService } from 'src/lib';
import { JwtService } from '@nestjs/jwt';

@Module({
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, PrismaService, SupabaseService, JwtService],
})
export class UserModule {}
