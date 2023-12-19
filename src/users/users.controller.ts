import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOkResponse({
    type: Boolean,
  })
  async getUserByName(@Query('name') name: string) {
    const user = await this.userService.getByLogin(name);

    if (!user) throw new BadRequestException('Нет пользователя с таким именем');

    return user.id;
  }
}
