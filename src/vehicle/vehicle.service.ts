import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/vehicle.create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entity/vehicle.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VehicleService {
  /**
   *
   */
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) { }
  async createVehicle(vehicle: CreateVehicleDto) {
    const entity = await this.vehicleRepository.save({ ...vehicle });
    console.log("🚀 ~ VehicleService ~ createVehicle ~ entity:", entity)

    return entity;
  }
}
