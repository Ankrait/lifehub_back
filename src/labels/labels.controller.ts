import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LabelsService } from './labels.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateLabelDto, LabelDto } from './dto';
import { CollaboratorsService } from '../collaborators/collaborators.service';
import { SessionInfo } from 'src/auth/session.decorator';
import { SessionDto } from 'src/auth/dto';
import { errorMessages } from 'src/common/errorMessages';
import { GroupLabelsService } from '../group-labels/group-labels.service';
import { RoleEnum } from '@prisma/client';

@ApiTags('Labels')
@Controller('labels')
@UseGuards(AuthGuard)
export class LabelsController {
  constructor(
    private readonly labelsService: LabelsService,
    private readonly collaboratorsService: CollaboratorsService,
    private readonly groupLabelsService: GroupLabelsService,
  ) {}

  private async checkUser(userId: number, id: ['group' | 'label', number]) {
    const groupId =
      id[0] === 'group'
        ? id[1]
        : (await this.groupLabelsService.getByLabelId(id[1]))?.groupId;
    if (!groupId) return false;

    const user = await this.collaboratorsService.get({ userId, groupId });
    if (!user) return false;

    return user.role;
  }

  @Get()
  @ApiOkResponse({
    type: LabelDto,
    isArray: true,
  })
  async getByGroupId(
    @SessionInfo() session: SessionDto,
    @Query('groupId', ParseIntPipe) groupId: number,
  ) {
    const access = await this.checkUser(session.id, ['group', groupId]);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);

    return await this.labelsService.getByGroup(groupId);
  }

  @Post()
  @ApiCreatedResponse({ type: LabelDto })
  async createLabel(
    @SessionInfo() session: SessionDto,
    @Body() body: CreateLabelDto,
  ) {
    const access = await this.checkUser(session.id, ['group', body.groupId]);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);

    return await this.labelsService.create(body);
  }

  @Delete('/:id')
  @ApiOkResponse()
  async deleteLabel(
    @SessionInfo() session: SessionDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const access = await this.checkUser(session.id, ['label', id]);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);
    if (access !== RoleEnum.OWNER)
      throw new BadRequestException(errorMessages.NO_RULE);

    await this.labelsService.delete(id);
  }
}
