import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupDto, UpdateGroupDto } from './dto';
import { DbService } from 'src/db/db.service';

@Injectable()
export class GroupsService {
  constructor(private readonly dbService: DbService) {}

  async create(dto: CreateGroupDto) {
    return await this.dbService.group.create({ data: dto });
  }

  async update(id: number, dto: UpdateGroupDto) {
    try {
      return await this.dbService.group.update({
        where: { id },
        data: dto,
      });
    } catch {
      throw new BadRequestException('Группа не найдена');
    }
  }

  async getByUser(userId: number) {
    return await this.dbService.group.findMany({
      where: { colaborators: { some: { id: userId } } },
    });
  }

  async getById(id: number) {
    return await this.dbService.group.findUnique({
      where: { id },
    });
  }

  async delete(id: number) {
    try {
      return await this.dbService.group.delete({ where: { id } });
    } catch {
      throw new BadRequestException('Группа не найдена');
    }
  }
}
