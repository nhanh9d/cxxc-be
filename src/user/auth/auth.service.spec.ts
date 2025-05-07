import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findByFirebaseId: jest.fn()
  };

  const mockJwtService = {
    signAsync: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('loginWithFirebase', () => {
    it('should return access token for existing user', async () => {
      const mockUser = { id: 1, fullname: 'Test User' };
      const mockToken = 'jwt-token';

      mockUserService.findByFirebaseId.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const result = await service.loginWithFirebase('firebase123');
      expect(result).toEqual({ accessToken: mockToken });
      expect(mockUserService.findByFirebaseId).toHaveBeenCalledWith('firebase123');
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({ sub: 1, fullname: 'Test User' });
    });

    it('should return undefined if user does not exist', async () => {
      mockUserService.findByFirebaseId.mockResolvedValue(null);

      const result = await service.loginWithFirebase('firebase123');
      expect(result).toBeUndefined();
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});