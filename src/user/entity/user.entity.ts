import { Vehicle } from '../../vehicle/entity/vehicle.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from "../../shared/entity/base.entity";
import { Event } from '../../event/entity/event.entity';
import { EventMember } from '../../event/entity/event-member.entity';
import { EventInvitation } from '../../event/entity/event-invitation.entity';

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

  @Column({ nullable: true })
  pushToken: string;

  @OneToMany(() => Vehicle, vehicle => vehicle.user)
  vehicles: Vehicle[];

  @OneToMany(() => Event, event => event.creator)
  createdEvents: Event[];

  @OneToMany(() => EventMember, member => member.user)
  eventMemberships: EventMember[];

  @OneToMany(() => EventInvitation, invitation => invitation.invitee)
  receivedInvitations: EventInvitation[];

  @OneToMany(() => EventInvitation, invitation => invitation.invitor)
  sentInvitations: EventInvitation[];
}
