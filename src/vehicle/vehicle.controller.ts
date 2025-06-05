import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { CreateVehicleDto } from './dto/vehicle.create.dto';
import { VehicleService } from './vehicle.service';
import { Public } from 'src/shared/decorators/public.decorator';
import { ApiResponse } from '@nestjs/swagger';

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

  @Get('user/:userId')
  @ApiResponse({ status: 200, description: 'Lấy danh sách xe theo userId thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 500, description: 'Lỗi server' })
  async getVehiclesByUserId(@Param('userId') userId: number) {
    return await this.vehicleService.getVehiclesByUserId(userId);
  }
}
