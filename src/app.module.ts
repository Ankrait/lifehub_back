import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { GroupsModule } from './groups/groups.module';
import { CollaboratorsModule } from './collaborators/collaborators.module';
import { LabelsModule } from './labels/labels.module';
import { GroupLabelsModule } from './group-labels/group-labels.module';
import { NotesModule } from './notes/notes.module';
import { PlansModule } from './plans/plans.module';
import { FinancesModule } from './finances/finances.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    DbModule,
    GroupsModule,
    CollaboratorsModule,
    LabelsModule,
    GroupLabelsModule,
    NotesModule,
    PlansModule,
    FinancesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
