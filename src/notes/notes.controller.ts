import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOkResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { CreateNoteDto, NoteDto, UpdateNoteDto } from './dto';
import { SessionInfo } from 'src/auth/session.decorator';
import { SessionDto } from 'src/auth/dto';
import { CollaboratorsService } from 'src/collaborators/collaborators.service';
import { RoleEnum } from '@prisma/client';
import { errorMessages } from 'src/common/errorMessages';

@ApiTags('Notes')
@Controller('notes')
@UseGuards(AuthGuard)
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly collaboratorsService: CollaboratorsService,
  ) {}

  private async checkUser(userId: number, id: ['group' | 'note', number]) {
    const groupId =
      id[0] === 'group'
        ? id[1]
        : (await this.notesService.getById(id[1]))?.groupId;

    if (!groupId) return false;

    const user = await this.collaboratorsService.get({
      groupId,
      userId,
    });
    if (!user) return false;

    return user.role;
  }

  @Get('/:id')
  @ApiOkResponse({ type: NoteDto })
  async GetNoteById(
    @SessionInfo() session: SessionDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const access = await this.checkUser(session.id, ['note', id]);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);

    return this.notesService.getById(id);
  }

  @Get()
  @ApiOkResponse({
    type: NoteDto,
    isArray: true,
  })
  async getNotesByGroup(
    @SessionInfo() session: SessionDto,
    @Query('groupId', ParseIntPipe) groupId: number,
  ) {
    const access = await this.checkUser(session.id, ['group', groupId]);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);

    return await this.notesService.getByGroupId(groupId);
  }

  @Post()
  @ApiCreatedResponse({
    type: NoteDto,
  })
  async createNote(
    @SessionInfo() session: SessionDto,
    @Body() body: CreateNoteDto,
  ) {
    const access = await this.checkUser(session.id, ['group', body.groupId]);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);

    return this.notesService.create(body);
  }

  @Delete('/:id')
  @ApiOkResponse()
  async deleteNote(
    @SessionInfo() session: SessionDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const access = await this.checkUser(session.id, ['note', id]);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);
    if (access === RoleEnum.USER)
      throw new BadRequestException(errorMessages.NO_RULE);

    await this.notesService.delete(id);
  }

  @Patch('/:id')
  async updateNote(
    @SessionInfo() session: SessionDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateNoteDto,
  ) {
    const access = await this.checkUser(session.id, ['note', id]);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);

    return this.notesService.update(id, body);
  }
}
