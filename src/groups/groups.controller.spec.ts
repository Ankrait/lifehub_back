import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { PlansService } from 'src/plans/plans.service';
import { NotesService } from 'src/notes/notes.service';
import { LabelsService } from 'src/labels/labels.service';
import { LabelEnum, RoleEnum } from '@prisma/client';
import { CollaboratorsModule } from 'src/collaborators/collaborators.module';
import { PlansModule } from 'src/plans/plans.module';
import { NotesModule } from 'src/notes/notes.module';
import { LabelsModule } from 'src/labels/labels.module';
import { DbModule } from 'src/db/db.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

describe('GroupsController', () => {
  let groupsController: GroupsController;
  let groupsService: GroupsService;
  let plansService: PlansService;
  let notesService: NotesService;
  let labelsService: LabelsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        DbModule,
        AuthModule,
        JwtModule,
        CollaboratorsModule,
        PlansModule,
        NotesModule,
        LabelsModule,
      ],
      controllers: [GroupsController],
      providers: [GroupsService],
    }).compile();

    groupsController = moduleRef.get<GroupsController>(GroupsController);
    groupsService = moduleRef.get<GroupsService>(GroupsService);
    plansService = moduleRef.get<PlansService>(PlansService);
    notesService = moduleRef.get<NotesService>(NotesService);
    labelsService = moduleRef.get<LabelsService>(LabelsService);
  });

  describe('getUserGroups', () => {
    it('should return user groups', async () => {
      const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };
      const groups = [
        { id: 1, name: 'Group 1', image: null },
        { id: 2, name: 'Group 2', image: null },
      ];

      jest.spyOn(groupsService, 'getByUser').mockResolvedValue(groups);

      const result = await groupsController.getUserGroups(session);

      expect(groupsService.getByUser).toHaveBeenCalledWith(session.id);
      expect(result).toEqual(groups);
    });
  });

  describe('getGroup', () => {
    it('should return group details if user has access', async () => {
      const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };
      const id = 333;
      const group = { id: id, name: 'Group 2', image: null };
      const notes = [
        { id: 1, message: 'Note 1', isImportant: false, groupId: group.id },
        { id: 2, message: 'Note 2', isImportant: false, groupId: group.id },
      ];
      const plans = [
        {
          id: 1,
          message: 'Plan 1',
          isFinished: true,
          labelId: null,
          label: null,
          groupId: group.id,
          dateTo: null,
        },
        {
          id: 2,
          message: 'Plan 2',
          isFinished: false,
          labelId: null,
          label: null,
          groupId: group.id,
          dateTo: null,
        },
      ];
      const labels = [
        { id: 1, text: 'Label 1', type: LabelEnum.ALL },
        { id: 2, text: 'Label 2', type: LabelEnum.ALL },
      ];

      jest
        .spyOn(groupsController as any, 'checkUser')
        .mockResolvedValue(RoleEnum.OWNER);
      jest.spyOn(groupsService, 'getById').mockResolvedValue(group);
      jest.spyOn(notesService, 'getByGroupId').mockResolvedValue(notes);
      jest.spyOn(plansService, 'getByGroup').mockResolvedValue(plans);
      jest.spyOn(labelsService, 'getByGroup').mockResolvedValue(labels);

      const result = await groupsController.getGroup(session, id);

      expect(groupsService.getById).toHaveBeenCalledWith(id);
      expect(notesService.getByGroupId).toHaveBeenCalledWith(id);
      expect(plansService.getByGroup).toHaveBeenCalledWith(id);
      expect(labelsService.getByGroup).toHaveBeenCalledWith(id);
      expect(result).toEqual({
        ...group,
        stats: {
          notesCount: notes.length,
          plansCount: {
            finished: plans.filter(el => el.isFinished).length,
            started: plans.filter(el => !el.isFinished).length,
          },
        },
        labels,
      });
    });
  });

  describe('updateGroup', () => {
    it('should update the group if user has access and is the owner', async () => {
      const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };
      const id = 1;
      const body = { name: 'Group 2' };
      const group = { id: id, name: 'Group 2', image: null };

      jest
        .spyOn(groupsController as any, 'checkUser')
        .mockResolvedValue(RoleEnum.OWNER);
      jest.spyOn(groupsService, 'update').mockResolvedValue(group);

      const result = await groupsController.updateGroup(session, id, body);

      expect(groupsService.update).toHaveBeenCalledWith(id, body);
      expect(result).toEqual(group);
    });

    it('should throw BadRequestException if user does not have access', async () => {
      const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };
      const id = 1;
      const body = { name: 'Updated Group' };

      jest.spyOn(groupsController as any, 'checkUser').mockResolvedValue(false);

      await expect(
        groupsController.updateGroup(session, id, body),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user has access but is not the owner', async () => {
      const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };
      const id = 1;
      const body = { name: 'Updated Group' };

      jest
        .spyOn(groupsController as any, 'checkUser')
        .mockResolvedValue(RoleEnum.USER);

      await expect(
        groupsController.updateGroup(session, id, body),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteGroup', () => {
    it('should delete the group if user has access and is the owner', async () => {
      const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };
      const id = 1;

      jest
        .spyOn(groupsController as any, 'checkUser')
        .mockResolvedValue(RoleEnum.OWNER);
      jest.spyOn(groupsService, 'delete').mockResolvedValue();

      await groupsController.deleteGroup(session, id);

      expect(groupsService.delete).toHaveBeenCalledWith(id);
    });

    it('should throw BadRequestException if user does not have access', async () => {
      const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };
      const id = 1;

      jest.spyOn(groupsController as any, 'checkUser').mockResolvedValue(false);

      await expect(groupsController.deleteGroup(session, id)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if user has access but is not the owner', async () => {
      const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };
      const id = 1;

      jest
        .spyOn(groupsController as any, 'checkUser')
        .mockResolvedValue(RoleEnum.USER);

      await expect(groupsController.deleteGroup(session, id)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
