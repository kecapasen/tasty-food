import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Payload } from './interfaces';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'userId' });
  }
  public async validate(userId: number, password: string): Promise<Payload> {
    const user = await this.authService.validateUser(userId, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
