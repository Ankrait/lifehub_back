import { Test, TestingModule } from '@nestjs/testing';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { CollaboratorsService } from 'src/collaborators/collaborators.service';
import { CreatePlanDto, PlanDto } from './dto';
import { BadRequestException } from '@nestjs/common';
import { RoleEnum } from '@prisma/client';
import { DbModule } from 'src/db/db.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

describe('PlansController', () => {
  let plansController: PlansController;
  let plansService: PlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DbModule, AuthModule, JwtModule],
      controllers: [PlansController],
      providers: [PlansService, CollaboratorsService],
    }).compile();

    plansController = module.get<PlansController>(PlansController);
    plansService = module.get<PlansService>(PlansService);
  });

  describe('getPlansByGroup', () => {
    it('should return plans by group', async () => {
      const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };
      const groupId = 1;
      const plans = [
        {
          id: 1,
          message: 'Message 1',
          isFinished: false,
          groupId: groupId,
          dateTo: null,
          labelId: null,
          label: null,
        },
        {
          id: 2,
          message: 'Message 2',
          isFinished: false,
          groupId: groupId,
          dateTo: null,
          labelId: null,
          label: null,
        },
      ];

      jest
        .spyOn(plansController as any, 'checkUser')
        .mockResolvedValue(RoleEnum.OWNER);
      jest.spyOn(plansService, 'getByGroup').mockResolvedValueOnce(plans);

      const result = await plansController.getPlansByGroup(session, groupId);

      expect(result).toEqual(plans);
    });

    it('should throw BadRequestException when no group access', async () => {
      const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };

      jest.spyOn(plansController as any, 'checkUser').mockResolvedValue(false);

      await expect(plansController.getPlansByGroup(session, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('createPlan', () => {
    it('should create a new plan', async () => {
      const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };
      const createPlan: CreatePlanDto = { message: 'New Plan', groupId: 1 };
      const returnPlan = {
        id: 2,
        label: null,
        labelId: null,
        dateTo: null,
        isFinished: false,
        ...createPlan,
      };

      jest
        .spyOn(plansController as any, 'checkUser')
        .mockResolvedValue(RoleEnum.OWNER);
      jest.spyOn(plansService, 'create').mockResolvedValueOnce(returnPlan);

      const result = await plansController.createPlan(session, createPlan);

      expect(result).toEqual(returnPlan);
    });

    it('should throw BadRequestException when no group access', async () => {
      const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };

      jest.spyOn(plansController as any, 'checkUser').mockResolvedValue(false);

      await expect(
        plansController.createPlan(session, {
          message: 'New Plan',
          groupId: 1,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('GetPlanById', () => {
    it('should return plan by id', async () => {
      const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };
      const plan: PlanDto = {
        id: 1,
        message: 'Message 1',
        isFinished: false,
        groupId: 1,
        dateTo: null,
        labelId: null,
        label: null,
      };

      jest
        .spyOn(plansController as any, 'checkUser')
        .mockResolvedValue(RoleEnum.OWNER);
      jest.spyOn(plansService, 'getById').mockResolvedValueOnce(plan);

      const result = await plansController.GetPlanById(session, plan.id);

      expect(result).toEqual(plan);
    });

    it('should throw BadRequestException when no plan access', async () => {
      const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };

      jest.spyOn(plansController as any, 'checkUser').mockResolvedValue(false);

      await expect(plansController.GetPlanById(session, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updatePlan', () => {
    it('should update an existing plan', async () => {
      const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };
      const planId = 1;
      const updatePlan = {
        message: 'Updated Plan',
        isFinished: true,
      };
      const returnPlan: PlanDto = {
        id: planId,
        label: null,
        labelId: null,
        dateTo: null,
        groupId: 1,
        ...updatePlan,
      };

      jest
        .spyOn(plansController as any, 'checkUser')
        .mockResolvedValue(RoleEnum.OWNER);
      jest.spyOn(plansService, 'update').mockResolvedValueOnce(returnPlan);

      const result = await plansController.updatePlan(
        session,
        planId,
        updatePlan,
      );

      expect(result).toEqual(returnPlan);
    });

    it('should throw BadRequestException when no plan access', async () => {
      const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };

      jest.spyOn(plansController as any, 'checkUser').mockResolvedValue(false);

      await expect(
        plansController.updatePlan(session, 1, { message: 'Updated Plan' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deletePlan', () => {
    it('should delete an existing plan', async () => {
      const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };
      const planId = 1;

      jest
        .spyOn(plansController as any, 'checkUser')
        .mockResolvedValue(RoleEnum.OWNER);
      jest.spyOn(plansService, 'delete').mockResolvedValueOnce(undefined);

      await plansController.deletePlan(session, planId);

      expect(plansService.delete).toHaveBeenCalledWith(planId);
    });

    it('should throw BadRequestException when no plan access', async () => {
      const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };

      jest.spyOn(plansController as any, 'checkUser').mockResolvedValue(false);

      await expect(plansController.deletePlan(session, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when user is not an admin', async () => {
      const session = { id: 9999, login: '', email: '', iat: 1, exp: 1 };

      jest
        .spyOn(plansController as any, 'checkUser')
        .mockResolvedValue(RoleEnum.USER);

      await expect(plansController.deletePlan(session, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
