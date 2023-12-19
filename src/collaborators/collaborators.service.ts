import { Injectable } from '@nestjs/common';
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

  async getByGroup(groupId: number) {
    return await this.dbService.collaborator.findMany({
      where: { groupId },
      include: { user: true },
    });
  }

  async get(dto: GetCollaboratorDto) {
    return await this.dbService.collaborator.findUnique({
      where: { userId_groupId: dto },
      include: { user: true },
    });
  }

  async create_update(dto: CreateCollaboratorDto) {
    return await this.dbService.collaborator.upsert({
      create: dto,
      where: { userId_groupId: { groupId: dto.groupId, userId: dto.userId } },
      update: { role: dto.role },
      include: { user: true },
    });
  }

  // Либо по id, либо по связи
  async delete(dto: DeleteCollaboratorDto | number) {
    await this.dbService.collaborator.delete({
      where: isNumber(dto) ? { id: dto } : { userId_groupId: dto },
    });
  }
}
