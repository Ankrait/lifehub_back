import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  Body,
} from '@nestjs/common';
import { FinancesService } from './finances.service';
import { CollaboratorsService } from '../collaborators/collaborators.service';
import { errorMessages } from 'src/common/errorMessages';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateFinanceDto, FinanceDto, UpdateFinanceDto } from './dto';
import { SessionInfo } from 'src/auth/session.decorator';
import { SessionDto } from 'src/auth/dto';
import { RoleEnum } from '@prisma/client';

@ApiTags('Finances')
@Controller('finances')
@UseGuards(AuthGuard)
export class FinancesController {
  constructor(
    private readonly financesService: FinancesService,
    private readonly collaboratorsService: CollaboratorsService,
  ) {}

  async checkUser(userId: number, id: ['group' | 'finance', number]) {
    const groupId =
      id[0] === 'group'
        ? id[1]
        : (await this.financesService.getById(id[1]))?.groupId;
    if (!groupId) return false;

    const user = await this.collaboratorsService.get({ userId, groupId });
    if (!user) return false;

    return user.role;
  }

  @Get('/:id')
  @ApiOkResponse({ type: FinanceDto })
  async getFinanceById(
    @SessionInfo() session: SessionDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const access = await this.checkUser(session.id, ['finance', id]);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);

    const fin = await this.financesService.getById(id);
    if (!fin) throw new BadRequestException(errorMessages.NOT_FOUND);
    return fin;
  }

  @Get()
  @ApiOkResponse({ type: Array<FinanceDto> })
  async getFinancesByGroupId(
    @SessionInfo() session: SessionDto,
    @Query('groupId', ParseIntPipe) groupId: number,
  ) {
    const access = await this.checkUser(session.id, ['group', groupId]);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);

    return await this.financesService.getByGroupId(groupId);
  }

  @Post()
  @ApiOkResponse({ type: FinanceDto })
  async createFinance(
    @SessionInfo() session: SessionDto,
    @Body() dto: CreateFinanceDto,
  ) {
    const access = await this.checkUser(session.id, ['group', dto.groupId]);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);

    return await this.financesService.create(dto);
  }

  @Patch(':/id')
  @ApiOkResponse({ type: FinanceDto })
  async updateFinance(
    @Param('id', ParseIntPipe) id: number,
    @SessionInfo() session: SessionDto,
    @Body() dto: UpdateFinanceDto,
  ) {
    const access = await this.checkUser(session.id, ['finance', id]);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);

    return await this.financesService.update(id, dto);
  }

  @Delete(':/id')
  @ApiOkResponse()
  async deleteFinance(
    @Param('id', ParseIntPipe) id: number,
    @SessionInfo() session: SessionDto,
  ) {
    const access = await this.checkUser(session.id, ['finance', id]);
    if (!access) throw new BadRequestException(errorMessages.NO_GROUP_ACCESS);
    if (access === RoleEnum.USER)
      throw new BadRequestException(errorMessages.NO_RULE);

    return await this.financesService.delete(id);
  }
}
