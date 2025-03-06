import { BaseEntity } from "src/shared/entity/base.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Event } from "./event.entity";
import { User } from "src/user/entity/user.entity";

export enum RoleType {
  host,
  member
}

export enum MemberStatus {
  registered, //with user who register event by themselves
  invited, //with user who is invited
  confirmed, // confirm payment
}

@Entity()
export class EventMember extends BaseEntity {
  @Column()
  status: MemberStatus;

  @Column()
  memberRole: RoleType;

  @Column()
  eventId: number;

  @OneToOne(() => Event)
  @JoinColumn()
  event: Event;

  @Column()
  userId: number;

  @OneToOne(() => User)
  @JoinColumn()
  member: User;
}