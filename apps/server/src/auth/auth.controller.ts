import { Controller, Post, UseGuards, Req, Res } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Payload } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async signin(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Payload> {
    return await this.authService.signin(req.user, res);
  }
}
