import { Injectable } from '@nestjs/common';
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
    const { groupId, ...restDto } = dto;
    return await this.dbService.label.create({
      data: { groupLabel: { create: { groupId } }, ...restDto },
    });
  }

  async delete(id: number) {
    await this.dbService.label.delete({ where: { id } });
  }
}
