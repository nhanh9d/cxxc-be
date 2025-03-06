import { VehicleType } from "../entity/vehicle.entity";

export class CreateVehicleDto {
  fullname: string;
  cylinderCapacity?: string;
  status?: VehicleType;
  images?: string[];
  userId: number;
}
