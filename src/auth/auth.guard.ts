import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CookieService } from './cookie.service';
import { JwtService } from '@nestjs/jwt';
import { SessionDto } from './dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest() as Request;
    const token = req.cookies[CookieService.tokenKey];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const sessionInfo = await this.jwtService.verifyAsync<SessionDto>(token, {
        secret: process.env.JWT_SECRET,
      });

      req['session'] = sessionInfo;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
