import { Module } from '@nestjs/common';
import { GroupLabelsService } from './group-labels.service';
import { GroupLabelsController } from './group-labels.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [GroupLabelsController],
  providers: [GroupLabelsService],
  exports: [GroupLabelsService],
})
export class GroupLabelsModule {}
