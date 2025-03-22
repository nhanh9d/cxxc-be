import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from "../../shared/entity/base.entity";
import { User } from "../../user/entity/user.entity";

export enum VehicleType {
  bike,
  motorbike,
  car,
  helicopter,
}

@Entity()
export class Vehicle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column()
  cylinderCapacity?: string;

  @Column({ type: "enum", enum: VehicleType, default: VehicleType.motorbike })
  status: VehicleType;

  @Column('varchar', { nullable: true, array: true })
  images: string[];

  @ManyToOne(() => User, user => user.vehicles, { onDelete: 'CASCADE' })
  user: User;
}
