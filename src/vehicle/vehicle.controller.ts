import { Body, Controller, Post } from '@nestjs/common';
import { CreateVehicleDto } from './dto/vehicle.create.dto';
import { VehicleService } from './vehicle.service';

@Controller('vehicle')
export class VehicleController {
  /**
   *
   */
  constructor(private readonly vehicleService: VehicleService) { }

  @Post('create')
  async createVehicle(@Body() params: CreateVehicleDto) {
    return await this.vehicleService.createVehicle(params);
  }
}
