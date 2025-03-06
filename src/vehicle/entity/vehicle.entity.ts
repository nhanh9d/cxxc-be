
import { BaseEntity } from 'src/shared/entity/base.entity';
import { Entity, Column } from 'typeorm';

export enum VehicleType {
  bike,
  motorbike,
  car,
  helicopter,
}

@Entity()
export class Vehicle extends BaseEntity {
  @Column()
  fullname: string;

  @Column()
  cylinderCapacity?: string;

  @Column({ type: "enum", enum: VehicleType, default: VehicleType.motorbike })
  status: VehicleType;

  @Column('varchar', { nullable: true, array: true })
  images: string[];

  @Column()
  userId: number;
}
