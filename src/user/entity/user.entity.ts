
import { BaseEntity } from 'src/shared/entity/base.entity';
import { Vehicle } from 'src/vehicle/entity/vehicle.entity';
import { Entity, Column, OneToMany } from 'typeorm';

export enum UserStatus {
  new,
  verified,
  locked,
  banned,
}

@Entity()
export class User extends BaseEntity {
  @Column()
  fullname: string;

  @Column()
  birthday: Date;

  @Column()
  gender: string;

  @Column()
  phone: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.new })
  status: UserStatus;

  @Column()
  firebaseId: string;

  @Column('varchar', { nullable: true, array: true })
  profileImages: string[];

  @Column('varchar', { nullable: true, array: true })
  verificationImages: string[];

  @OneToMany(() => Vehicle, vehicle => vehicle.userId)
  vehicles: Vehicle[];
}
