import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';

import { DbModule } from 'src/db/db.module';
import { CollaboratorsModule } from 'src/collaborators/collaborators.module';
import { PlansModule } from 'src/plans/plans.module';
import { NotesModule } from 'src/notes/notes.module';
import { LabelsModule } from 'src/labels/labels.module';

@Module({
  imports: [
    DbModule,
    CollaboratorsModule,
    PlansModule,
    NotesModule,
    LabelsModule,
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
