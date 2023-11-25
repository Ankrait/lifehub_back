import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateFinanceDto, UpdateFinanceDto } from './dto';

@Injectable()
export class FinancesService {
  constructor(private readonly dbService: DbService) {}

  async getById(id: number) {
    return await this.dbService.finance.findUnique({ where: { id } });
  }

  async getByGroupId(groupId: number) {
    return await this.dbService.finance.findMany({ where: { groupId } });
  }

  async create(dto: CreateFinanceDto) {
    return await this.dbService.finance.create({ data: dto });
  }

  async update(id: number, dto: UpdateFinanceDto) {
    return await this.dbService.finance.update({ where: { id }, data: dto });
  }

  async delete(id: number) {
    await this.dbService.finance.delete({ where: { id } });
  }
}
