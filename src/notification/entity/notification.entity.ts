import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';

export enum EventNotificationType {
  EVENT_FINISHED = 'EVENT_FINISHED',
  EVENT_INVITATION = "EVENT_INVITATION",
  EVENT_UPDATE = "EVENT_UPDATE",
  EVENT_CANCEL = "EVENT_CANCEL",
  EVENT_CREATED = "EVENT_CREATED",
}

export enum EventMemberNotificationType {
  EVENT_MEMBER_JOINED = 'EVENT_MEMBER_JOINED',
  EVENT_MEMBER_LEFT = 'EVENT_MEMBER_LEFT',
  EVENT_MEMBER_INVITATION = "EVENT_MEMBER_INVITATION",
  EVENT_MEMBER_REJECTED = "EVENT_MEMBER_REJECTED",
  EVENT_MEMBER_ACCEPTED = "EVENT_MEMBER_ACCEPTED",
  EVENT_MEMBER_REMOVED = "EVENT_MEMBER_REMOVED",
}

export enum UserNotificationType {
  USER_PROFILE_UPDATED = 'USER_PROFILE_UPDATED',
  USER_PROFILE_VERIFIED = 'USER_PROFILE_VERIFIED',
  USER_PROFILE_REJECTED = 'USER_PROFILE_REJECTED',
}

export enum VehicleNotificationType {
  VEHICLE_CREATED = 'VEHICLE_CREATED',
  VEHICLE_UPDATED = 'VEHICLE_UPDATED',
  VEHICLE_VERIFIED = 'VEHICLE_VERIFIED',
  VEHICLE_REJECTED = 'VEHICLE_REJECTED',
}

export type NotificationType = 
  | EventNotificationType 
  | EventMemberNotificationType 
  | UserNotificationType 
  | VehicleNotificationType;

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ 
    type: 'enum', 
    enum: [
      ...Object.values(EventNotificationType),
      ...Object.values(EventMemberNotificationType),
      ...Object.values(UserNotificationType),
      ...Object.values(VehicleNotificationType),
    ] 
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  isPushed: boolean;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
} 