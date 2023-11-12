import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  async getByEmail(email: string) {
    return await this.dbService.user.findUnique({ where: { email } });
  }

  async getByLogin(login: string) {
    return await this.dbService.user.findUnique({ where: { login } });
  }

  async create(data: {
    email: string;
    login: string;
    hash: string;
    salt: string;
  }) {
    const user = await this.dbService.user.create({ data });

    return user;
  }
}
