import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateNoteDto, UpdateNoteDto } from './dto';

@Injectable()
export class NotesService {
  constructor(private readonly dbService: DbService) {}

  async getById(id: number) {
    return await this.dbService.note.findUnique({ where: { id } });
  }

  async getByGroupId(groupId: number) {
    return await this.dbService.note.findMany({
      where: { groupId },
    });
  }

  async create(dto: CreateNoteDto) {
    try {
      return await this.dbService.note.create({ data: dto });
    } catch {
      throw new BadRequestException('Группа не найдена');
    }
  }

  async update(id: number, dto: UpdateNoteDto) {
    try {
      return await this.dbService.note.update({
        where: { id },
        data: dto,
      });
    } catch {
      throw new BadRequestException('Заметка не найдена');
    }
  }

  async delete(id: number) {
    const deleted = await this.dbService.note.deleteMany({ where: { id } });

    if (deleted.count === 0)
      throw new BadRequestException('Заметка не найдена');
  }
}
