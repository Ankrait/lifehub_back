import { Controller, UseGuards } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Labels')
@Controller('labels')
@UseGuards(AuthGuard)
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}
}
