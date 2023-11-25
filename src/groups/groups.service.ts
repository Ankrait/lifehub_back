import { Injectable } from '@nestjs/common';
import { CreateGroupDto, UpdateGroupDto } from './dto';
import { DbService } from 'src/db/db.service';

@Injectable()
export class GroupsService {
  constructor(private readonly dbService: DbService) {}

  async create(dto: CreateGroupDto) {
    return await this.dbService.group.create({ data: dto });
  }

  async update(id: number, dto: UpdateGroupDto) {
    return await this.dbService.group.update({
      where: { id },
      data: dto,
    });
  }

  async getByUser(userId: number) {
    return await this.dbService.group.findMany({
      where: { colaborators: { some: { userId } } },
    });
  }

  async getById(id: number) {
    return await this.dbService.group.findUnique({
      where: { id },
    });
  }

  async delete(id: number) {
    await this.dbService.group.delete({ where: { id } });
  }
}
