import { Module } from '@nestjs/common';
import { FinancesService } from './finances.service';
import { FinancesController } from './finances.controller';
import { DbModule } from 'src/db/db.module';
import { CollaboratorsModule } from 'src/collaborators/collaborators.module';

@Module({
  imports: [DbModule, CollaboratorsModule],
  controllers: [FinancesController],
  providers: [FinancesService],
  exports: [FinancesService],
})
export class FinancesModule {}
