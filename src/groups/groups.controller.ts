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
import { errorMessages } from 'src/common/errorMessages';

@ApiTags('Groups')
@Controller('groups')
@UseGuards(AuthGuard)
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly collaboratorsService: CollaboratorsService,
  ) {}

  private async checkUser(userId: number, groupId: number) {
    const user = await this.collaboratorsService.get({ groupId, userId });
    if (!user) return false;
    return user.role;
  }

  @Get()
  @ApiOkResponse({
    type: GroupDto,
    isArray: true,
  })
  async getUserGroups(@SessionInfo() session: SessionDto) {
    return await this.groupsService.getByUser(session.id);
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

  @Get('/:id')
  @ApiOkResponse({
    type: GroupDto,
  })
  async getGroup(
    @SessionInfo() session: SessionDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const access = await this.checkUser(session.id, id);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);

    return await this.groupsService.getById(id);
  }

  @Patch('/:id')
  @ApiOkResponse({
    type: GroupDto,
  })
  async updateGroup(
    @SessionInfo() session: SessionDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateGroupDto,
  ) {
    const access = await this.checkUser(session.id, id);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);
    if (access !== RoleEnum.OWNER)
      throw new BadRequestException(errorMessages.NO_RULE);

    return await this.groupsService.update(id, body);
  }

  @Delete('/:id')
  async deleteGroup(
    @SessionInfo() session: SessionDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const access = await this.checkUser(session.id, id);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);
    if (access !== RoleEnum.OWNER)
      throw new BadRequestException(errorMessages.NO_RULE);

    await this.groupsService.delete(id);
  }
}
