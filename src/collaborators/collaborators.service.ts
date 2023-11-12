import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import {
  CreateCollaboratorDto,
  DeleteCollaboratorDto,
  GetCollaboratorDto,
} from './dto';
import { isNumber } from 'class-validator';

@Injectable()
export class CollaboratorsService {
  constructor(private readonly dbService: DbService) {}

  async get(dto: GetCollaboratorDto) {
    return await this.dbService.collaborator.findUnique({
      where: { userId_groupId: dto },
    });
  }

  async create_update(dto: CreateCollaboratorDto) {
    return await this.dbService.collaborator.upsert({
      create: dto,
      where: { userId_groupId: { groupId: dto.groupId, userId: dto.userId } },
      update: { role: dto.role },
    });
  }

  // Либо по id, либо по связи
  async delete(dto: DeleteCollaboratorDto | number) {
    const deleted = await this.dbService.collaborator.deleteMany({
      where: isNumber(dto) ? { id: dto } : dto,
    });

    if (deleted.count === 0)
      throw new BadRequestException('Пользователь или группа не найденны');
  }
}
