import { Controller } from '@nestjs/common';
import { GroupLabelsService } from './group-labels.service';

@Controller('group-labels')
export class GroupLabelsController {
  constructor(private readonly groupLabelsService: GroupLabelsService) {}
}
