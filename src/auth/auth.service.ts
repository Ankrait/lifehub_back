import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegistrationDto } from './dto';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const errorMessage = 'Неверный логин или пароль';

    const user =
      (await this.userService.getByEmail(dto.email_login)) ||
      (await this.userService.getByLogin(dto.email_login));
    if (!user) {
      throw new UnauthorizedException(errorMessage);
    }

    const hash = this.passwordService.getHash(dto.password, user.salt);
    if (hash !== user.hash) {
      throw new UnauthorizedException(errorMessage);
    }

    const token = await this.jwtService.signAsync({
      id: user.id,
      login: user.login,
      email: user.email,
    });

    return { token };
  }

  async registration(dto: RegistrationDto) {
    const userSameEmail = await this.userService.getByEmail(dto.email);
    if (userSameEmail) {
      throw new BadRequestException('Почта занята');
    }

    const userSameLogin = await this.userService.getByLogin(dto.login);
    if (userSameLogin) {
      throw new BadRequestException('Логин занят');
    }

    const salt = this.passwordService.getSalt();
    const hash = this.passwordService.getHash(dto.password, salt);

    const newUser = await this.userService.create({
      email: dto.email,
      login: dto.login,
      salt,
      hash,
    });

    const token = await this.jwtService.signAsync({
      id: newUser.id,
      login: newUser.login,
      email: newUser.email,
    });

    return { token };
  }
}
