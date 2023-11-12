import { BadRequestException, Injectable } from '@nestjs/common';
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
    try {
      return await this.dbService.finance.update({ where: { id }, data: dto });
    } catch {
      throw new BadRequestException('Финансовая запись не найдена');
    }
  }

  async delete(id: number) {
    const deleted = await this.dbService.finance.deleteMany({ where: { id } });

    if (deleted.count === 0)
      throw new BadRequestException('Финансовая запись не найдена');
  }
}
