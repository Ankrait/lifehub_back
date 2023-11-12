import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegistrationDto, SessionDto } from './dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CookieService } from './cookie.service';
import { Response } from 'express';
import { SessionInfo } from './session.decorator';
import { AuthGuard } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('login')
  @ApiOkResponse()
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token } = await this.authService.login(body);

    this.cookieService.setToken(res, token);
  }

  @Post('registration')
  @ApiCreatedResponse()
  async registration(
    @Body() body: RegistrationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token } = await this.authService.registration(body);

    this.cookieService.setToken(res, token);
  }

  @Get('logout')
  @UseGuards(AuthGuard)
  @ApiOkResponse()
  logout(@Res({ passthrough: true }) res: Response) {
    this.cookieService.removeToken(res);
  }

  @Get('session')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: SessionDto,
  })
  getSession(@SessionInfo() session: SessionDto) {
    return session;
  }
}
