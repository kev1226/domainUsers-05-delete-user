import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersService - remove', () => {
  let service: UsersService;
  const mockRepo = {
    findOne: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  it(' debe eliminar lógicamente si el usuario existe', async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1 });
    mockRepo.softDelete.mockResolvedValue(undefined);

    const result = await service.remove(1);

    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockRepo.softDelete).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      message: `User with ID 1 was deleted successfully`,
    });
  });

  it(' debe lanzar NotFoundException si el usuario no existe', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    expect(mockRepo.softDelete).not.toHaveBeenCalled();
  });
});
