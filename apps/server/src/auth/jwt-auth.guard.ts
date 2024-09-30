import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Role } from '@repo/db';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/lib';
import { WsException } from '@nestjs/websockets';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isHttp = context.getType() === 'http';
    const request = isHttp
      ? context.switchToHttp().getRequest()
      : context.switchToWs().getClient().handshake;
    const token = request.cookies?.Authentication || undefined;
    if (!token) {
      throw isHttp
        ? new UnauthorizedException()
        : new WsException('Unauthorized');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow<string>('SECRET'),
      });
      const user = await this.prismaService.user.findUnique({
        where: {
          userId: payload.userId,
        },
      });
      if (!user) {
        throw new UnauthorizedException();
      }
      if (isHttp) {
        request['user'] = user;
      } else {
        context.switchToWs().getClient().user = user;
      }
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>('ROLES', [
        context.getHandler(),
        context.getClass(),
      ]);
      if (
        requiredRoles &&
        !requiredRoles.some((role) => user.role?.includes(role))
      ) {
        throw isHttp
          ? new UnauthorizedException()
          : new WsException('Forbidden');
      }
      return true;
    } catch (error) {
      throw isHttp
        ? new UnauthorizedException()
        : new WsException('Unauthorized');
    }
  }
}
