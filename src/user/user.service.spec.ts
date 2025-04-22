import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOneBy: jest.fn(),
    exists: jest.fn(),
    save: jest.fn(),
    update: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByFirebaseId', () => {
    it('should find a user by firebase id', async () => {
      const mockUser = { id: 1, firebaseId: 'firebase123' };
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findByFirebaseId('firebase123');
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ firebaseId: 'firebase123' });
    });
  });

  describe('existFirebaseId', () => {
    it('should check if a firebase id exists', async () => {
      mockUserRepository.exists.mockResolvedValue(true);

      const result = await service.existFirebaseId('firebase123');
      expect(result).toBe(true);
      expect(mockUserRepository.exists).toHaveBeenCalledWith({ where: { firebaseId: 'firebase123' } });
    });
  });

  describe('createUser', () => {
    it('should create a new user if firebase id does not exist', async () => {
      const userDto: UserDto = {
        fullname: 'Test User',
        birthday: new Date(),
        gender: 'male',
        phone: '1234567890',
        isActive: true,
        firebaseId: 'firebase123',
        profileImages: [],
        verificationImages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const mockUser = { id: 1, ...userDto };

      mockUserRepository.exists.mockResolvedValue(false);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.createUser(userDto);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.save).toHaveBeenCalledWith(userDto);
    });

    it('should return existing user if firebase id exists', async () => {
      const userDto: UserDto = {
        fullname: 'Test User',
        birthday: new Date(),
        gender: 'male',
        phone: '1234567890',
        isActive: true,
        firebaseId: 'firebase123',
        profileImages: [],
        verificationImages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const mockUser = { id: 1, ...userDto };

      mockUserRepository.exists.mockResolvedValue(true);
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.createUser(userDto);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const userDto: UserDto = {
        fullname: 'Updated User',
        birthday: new Date(),
        gender: 'male',
        phone: '1234567890',
        isActive: true,
        firebaseId: 'firebase123',
        profileImages: [],
        verificationImages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const existingUser = { id: 1, fullname: 'Test User', firebaseId: 'firebase123' };
      const updatedUser = { ...existingUser, ...userDto };

      mockUserRepository.findOneBy.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(userDto);
      expect(result).toBe(true);
      expect(mockUserRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should return false if user does not exist', async () => {
      const userDto: UserDto = {
        fullname: 'Updated User',
        birthday: new Date(),
        gender: 'male',
        phone: '1234567890',
        isActive: true,
        firebaseId: 'firebase123',
        profileImages: [],
        verificationImages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepository.findOneBy.mockResolvedValue(null);

      const result = await service.updateUser(userDto);
      expect(result).toBe(false);
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const mockUser = { id: 1, fullname: 'Test User' };
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findById(1);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('findByPushToken', () => {
    it('should find a user by push token', async () => {
      const mockUser = { id: 1, pushToken: 'token123' };
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findByPushToken('token123');
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ pushToken: 'token123' });
    });
  });

  describe('updatePushToken', () => {
    it('should update a user push token', async () => {
      await service.updatePushToken(1, 'newToken123');
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, { pushToken: 'newToken123' });
    });
  });
});