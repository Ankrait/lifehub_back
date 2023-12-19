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
import { PlansService } from './plans.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreatePlanDto, PlanDto, UpdatePlanDto } from './dto';
import { errorMessages } from 'src/common/errorMessages';
import { CollaboratorsService } from 'src/collaborators/collaborators.service';
import { SessionInfo } from 'src/auth/session.decorator';
import { SessionDto } from 'src/auth/dto';
import { RoleEnum } from '@prisma/client';

@ApiTags('Plans')
@Controller('plans')
@UseGuards(AuthGuard)
export class PlansController {
  constructor(
    private readonly plansService: PlansService,
    private readonly collaboratorsService: CollaboratorsService,
  ) {}

  private async checkUser(userId: number, id: ['group' | 'plan', number]) {
    const groupId =
      id[0] === 'group'
        ? id[1]
        : (await this.plansService.getById(id[1]))?.groupId;
    if (!groupId) return false;

    const user = await this.collaboratorsService.get({
      userId,
      groupId,
    });
    if (!user) return false;

    return user.role;
  }

  @Get()
  @ApiOkResponse({
    type: PlanDto,
    isArray: true,
  })
  async getPlansByGroup(
    @SessionInfo() session: SessionDto,
    @Query('groupId', ParseIntPipe) groupId: number,
  ) {
    const access = await this.checkUser(session.id, ['group', groupId]);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);

    return (await this.plansService.getByGroup(groupId)).sort(
      (a, b) => a.id - b.id,
    );
  }

  @Post()
  @ApiCreatedResponse({
    type: PlanDto,
  })
  async createPlan(
    @SessionInfo() session: SessionDto,
    @Body() body: CreatePlanDto,
  ) {
    const access = await this.checkUser(session.id, ['group', body.groupId]);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);

    return await this.plansService.create(body);
  }

  @Get('/:id')
  @ApiOkResponse({
    type: PlanDto,
  })
  async GetPlanById(
    @SessionInfo() session: SessionDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const access = await this.checkUser(session.id, ['plan', id]);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);

    return await this.plansService.getById(id);
  }

  @Patch('/:id')
  @ApiOkResponse({
    type: PlanDto,
  })
  async updatePlan(
    @SessionInfo() session: SessionDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePlanDto,
  ) {
    const access = await this.checkUser(session.id, ['plan', id]);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);

    return await this.plansService.update(id, body);
  }

  @Delete('/:id')
  @ApiOkResponse()
  async deletePlan(
    @SessionInfo() session: SessionDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const access = await this.checkUser(session.id, ['plan', id]);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);
    if (access === RoleEnum.USER)
      throw new BadRequestException('Вы не имеете доступа');

    await this.plansService.delete(id);
  }
}
