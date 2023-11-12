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
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { SessionInfo } from 'src/auth/session.decorator';
import { SessionDto } from 'src/auth/dto';
import { CreateGroupDto, GroupDto, UpdateGroupDto } from './dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CollaboratorsService } from '../collaborators/collaborators.service';
import { RoleEnum } from '@prisma/client';

@ApiTags('Groups')
@Controller('groups')
@UseGuards(AuthGuard)
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly collaboratorsService: CollaboratorsService,
  ) {}

  @Get()
  @ApiOkResponse({
    type: Array<GroupDto>,
  })
  async getUserGroups(@SessionInfo() session: SessionDto) {
    return await this.groupsService.getByUser(session.id);
  }

  @Get('/:id')
  @ApiOkResponse({
    type: GroupDto,
  })
  async getGroup(@Param('id', ParseIntPipe) id: number) {
    const group = await this.groupsService.getById(id);

    if (!group) throw new BadRequestException('Группа не найдена');

    return group;
  }

  @Post()
  @ApiCreatedResponse({
    type: GroupDto,
  })
  async createGroup(
    @SessionInfo() session: SessionDto,
    @Body() body: CreateGroupDto,
  ) {
    const group = await this.groupsService.create(body);

    this.collaboratorsService.create_update({
      groupId: group.id,
      userId: session.id,
      role: RoleEnum.OWNER,
    });

    return group;
  }

  @Patch('/:id')
  @ApiOkResponse({
    type: GroupDto,
  })
  async updateGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateGroupDto,
  ) {
    return await this.groupsService.update(id, body);
  }

  @Delete('/:id')
  async deleteGroup(@Param('id', ParseIntPipe) id: number) {
    await this.groupsService.delete(id);
  }
}
