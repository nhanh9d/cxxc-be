import { Body, Controller, Post } from '@nestjs/common';
import { CreateVehicleDto } from './dto/vehicle.create.dto';
import { VehicleService } from './vehicle.service';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('vehicle')
export class VehicleController {
  /**
   *
   */
  constructor(private readonly vehicleService: VehicleService) { }

  @Public()
  @Post('create')
  async createVehicle(@Body() params: CreateVehicleDto) {
    return await this.vehicleService.createVehicle(params);
  }
}
