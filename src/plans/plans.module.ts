import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { DbModule } from 'src/db/db.module';
import { CollaboratorsModule } from 'src/collaborators/collaborators.module';

@Module({
  imports: [DbModule, CollaboratorsModule],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService],
})
export class PlansModule {}
