import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

describe('VehicleController', () => {
  let controller: VehicleController;
  let service: VehicleService;

  const mockVehicleService = {
    createVehicle: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [
        {
          provide: VehicleService,
          useValue: mockVehicleService
        }
      ],
    }).compile();

    controller = module.get<VehicleController>(VehicleController);
    service = module.get<VehicleService>(VehicleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createVehicle', () => {
    it('should create a new vehicle', async () => {
      const createVehicleDto: CreateVehicleDto = {
        brand: 'Toyota',
        model: 'Camry',
        licensePlate: 'ABC123',
        userId: 1
      };
      const mockVehicle = { id: 1, ...createVehicleDto };

      mockVehicleService.createVehicle.mockResolvedValue(mockVehicle);

      const result = await controller.createVehicle(createVehicleDto);
      expect(result).toEqual(mockVehicle);
      expect(mockVehicleService.createVehicle).toHaveBeenCalledWith(createVehicleDto);
    });
  });
});