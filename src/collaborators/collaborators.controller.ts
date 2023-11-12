import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  CollaboratorDto,
  CreateCollaboratorDto,
  DeleteCollaboratorDto,
} from './dto';
import { SessionInfo } from 'src/auth/session.decorator';
import { SessionDto } from 'src/auth/dto';
import { RoleEnum } from '@prisma/client';

@ApiTags('Collaborators')
@Controller('collaborators')
@UseGuards(AuthGuard)
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  @Post('/create_update')
  @ApiCreatedResponse({
    type: CollaboratorDto,
  })
  async create(
    @SessionInfo() session: SessionDto,
    @Body() body: CreateCollaboratorDto,
  ) {
    const creator = await this.collaboratorsService.get({
      groupId: body.groupId,
      userId: session.id,
    });

    if (!creator || creator.role === RoleEnum.USER)
      throw new BadRequestException(
        'Вы не можете добавить участника в эту группу',
      );

    return this.collaboratorsService.create_update(body);
  }

  @Post('/delete')
  @ApiOkResponse()
  async delete(
    @SessionInfo() session: SessionDto,
    @Body() body: DeleteCollaboratorDto,
  ) {
    const deletor = await this.collaboratorsService.get({
      groupId: body.groupId,
      userId: session.id,
    });

    if (!deletor || deletor.role !== RoleEnum.OWNER)
      throw new BadRequestException('Вы не можете удалить эту группу');

    return this.collaboratorsService.delete(body);
  }
}
