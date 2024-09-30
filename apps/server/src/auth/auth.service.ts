import {
  Injectable,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Payload } from './interfaces';
import { Response } from 'express';
import { addDays } from 'date-fns';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configServide: ConfigService,
  ) {}
  public async validateUser(userId: number, pass: string): Promise<Payload> {
    const { data } = await this.userService.getUserById(
      parseInt(userId as unknown as string),
    );
    if (!data) throw new NotFoundException();
    if (data.password !== pass) throw new UnauthorizedException();
    return { userId: data.userId };
  }
  public async signin(payload: Payload, res: Response) {
    const expire = addDays(new Date(), 7);
    const token = this.jwtService.sign(payload, {
      secret: this.configServide.getOrThrow<string>('SECRET'),
    });
    res.cookie('Authentication', token, {
      expires: expire,
    });
    return payload;
  }
}
