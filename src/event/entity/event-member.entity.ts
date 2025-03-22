import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Event } from "./event.entity";
import { User } from "../../user/entity/user.entity";
import { BaseEntity } from "../../shared/entity/base.entity";

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

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Event, event => event.members, { onDelete: 'CASCADE' })
  event: Event;
}