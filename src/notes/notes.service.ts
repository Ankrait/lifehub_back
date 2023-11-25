import { Injectable } from '@nestjs/common';
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
    return await this.dbService.note.create({ data: dto });
  }

  async update(id: number, dto: UpdateNoteDto) {
    return await this.dbService.note.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number) {
    await this.dbService.note.delete({ where: { id } });
  }
}
