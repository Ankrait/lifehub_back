import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { ActionGroupLabelDto } from './dto';
import { isNumber } from 'class-validator';

@Injectable()
export class GroupLabelsService {
  constructor(private readonly dbService: DbService) {}

  async getByLabelId(labelId: number) {
    return await this.dbService.groupLabel.findUnique({ where: { labelId } });
  }

  async create(dto: ActionGroupLabelDto) {
    try {
      return await this.dbService.groupLabel.create({
        data: dto,
      });
    } catch (e) {
      if (e?.code === 'P2002') {
        throw new BadRequestException('Тег уже привязан к данной группе');
      }

      // P2003
      throw new BadRequestException('Тег или группа не найдены');
    }
  }

  // Либо по id, либо по связи
  async delete(dto: ActionGroupLabelDto | number) {
    await this.dbService.groupLabel.delete({
      where: isNumber(dto) ? { id: dto } : dto,
    });
  }
}
