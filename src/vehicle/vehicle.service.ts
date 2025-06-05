import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/vehicle.create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entity/vehicle.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class VehicleService {
  /**
   *
   */
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly userService: UserService
  ) { }
  async createVehicle(vehicle: CreateVehicleDto) {
    const user = await this.userService.findById(vehicle.userId);
    const entity = await this.vehicleRepository.save({ ...vehicle, user });
    console.log("🚀 ~ VehicleService ~ createVehicle ~ entity:", entity)

    return entity;
  }
}
