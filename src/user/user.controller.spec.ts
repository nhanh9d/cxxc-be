import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from './auth/auth.service';
import { UserDto } from './dto/user.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let authService: AuthService;

  const mockUserService = {
    createUser: jest.fn(),
    updateUser: jest.fn(),
    findById: jest.fn(),
    updatePushToken: jest.fn()
  };

  const mockAuthService = {
    loginWithFirebase: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService
        },
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return login result for firebase id', async () => {
      const mockLoginResult = { accessToken: 'token123' };
      mockAuthService.loginWithFirebase.mockResolvedValue(mockLoginResult);

      const result = await controller.getUserById('firebase123');
      expect(result).toEqual(mockLoginResult);
      expect(mockAuthService.loginWithFirebase).toHaveBeenCalledWith('firebase123');
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
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

      mockUserService.createUser.mockResolvedValue(mockUser);

      const result = await controller.createUser(userDto);
      expect(result).toEqual(mockUser);
      expect(mockUserService.createUser).toHaveBeenCalledWith(userDto);
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

      mockUserService.updateUser.mockResolvedValue(true);

      const result = await controller.updateUser(userDto);
      expect(result).toBe(true);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(userDto);
    });
  });

  describe('getMe', () => {
    it('should return the current user', async () => {
      const mockUser = { id: 1, fullname: 'Test User' };
      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await controller.getMe({ user: { sub: 1 } });
      expect(result).toEqual(mockUser);
      expect(mockUserService.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('updatePushToken', () => {
    it('should update user push token', async () => {
      const mockResponse = { message: 'Push token updated successfully' };

      const result = await controller.updatePushToken({ user: { sub: 1 } }, 'token123');
      expect(result).toEqual(mockResponse);
      expect(mockUserService.updatePushToken).toHaveBeenCalledWith(1, 'token123');
    });
  });
});