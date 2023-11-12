import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { DbModule } from 'src/db/db.module';
import { CollaboratorsModule } from 'src/collaborators/collaborators.module';

@Module({
  imports: [DbModule, CollaboratorsModule],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
