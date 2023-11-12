import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { DbModule } from 'src/db/db.module';
import { CollaboratorsModule } from 'src/collaborators/collaborators.module';

@Module({
  imports: [DbModule, CollaboratorsModule],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesService],
})
export class NotesModule {}
