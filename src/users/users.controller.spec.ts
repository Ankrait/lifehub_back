import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DbModule } from 'src/db/db.module';
import { BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DbModule],
      providers: [UsersService],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('getUserByName', () => {
    it('should return user id if user exists', async () => {
      const id = 6;
      const name = 'Name';
      const user = { id, login: name, email: '', hash: '', salt: '' };

      jest.spyOn(service, 'getByLogin').mockResolvedValue(user);

      const result = await controller.getUserByName(name);

      expect(result).toBe(id);
    });
    it('should throw BadRequestException if user does not exist', async () => {
      const name = 'John';

      jest.spyOn(service, 'getByLogin').mockResolvedValue(null);

      await expect(controller.getUserByName(name)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.getByLogin).toHaveBeenCalledWith(name);
    });
  });
});
