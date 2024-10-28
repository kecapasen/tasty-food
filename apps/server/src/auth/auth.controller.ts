import {
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Payload } from './interfaces';
import { JwtAuthGuard } from './jwt-auth.guard';
import { StaffOnly } from './auth.decorator';
import { Role } from '@repo/db';
import { User } from './user.decorator';
import { GetUserDTO, ResponseDTO } from '@repo/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  public async signin(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Payload> {
    return await this.authService.signin(req.user, res);
  }

  @UseGuards(JwtAuthGuard)
  @StaffOnly(Role.ADMIN, Role.CHEF, Role.WAITER)
  @Get('getme')
  public async getMe(
    @User('userId', ParseIntPipe) userId: number,
  ): Promise<ResponseDTO & { data?: GetUserDTO }> {
    return await this.authService.getMe(userId);
  }
}
