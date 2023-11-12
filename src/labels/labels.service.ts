import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateLabelDto } from './dto';

@Injectable()
export class LabelsService {
  constructor(private readonly dbService: DbService) {}

  async getByGroup(groupId: number) {
    return await this.dbService.label.findMany({
      where: { groupLabel: { groupId } },
    });
  }

  async getById(id: number) {
    return await this.dbService.label.findUnique({ where: { id } });
  }

  async create(dto: CreateLabelDto) {
    return await this.dbService.label.create({ data: dto });
  }

  async delete(id: number) {
    const deleted = await this.dbService.label.deleteMany({ where: { id } });

    if (deleted.count === 0) throw new BadRequestException('Тег не найден');
  }
}
