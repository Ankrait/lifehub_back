import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegistrationDto {
  @ApiProperty({ default: 'azat@mail.ru' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ default: 'Azat11' })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(12)
  login: string;

  @ApiProperty({ default: 'Password1!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginDto {
  @ApiProperty({ default: 'Azat11' })
  @IsString()
  @IsNotEmpty()
  email_login: string;

  @ApiProperty({ default: 'Password1!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SessionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  login: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  iat: number;
  @ApiProperty()
  exp: number;
}
