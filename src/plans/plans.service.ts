import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreatePlanDto, UpdatePlanDto } from './dto';

@Injectable()
export class PlansService {
  constructor(private readonly dbService: DbService) {}

  async getById(id: number) {
    return await this.dbService.plan.findUnique({ where: { id } });
  }

  async getByGroup(groupId: number) {
    return await this.dbService.plan.findMany({ where: { groupId } });
  }

  async create(dto: CreatePlanDto) {
    return await this.dbService.plan.create({ data: dto });
  }

  async update(id: number, dto: UpdatePlanDto) {
    return await this.dbService.plan.update({ where: { id }, data: dto });
  }

  async delete(id: number) {
    this.dbService.plan.delete({ where: { id } });
  }
}
// TODO - переписать все dto -> поля undefined на null
