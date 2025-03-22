import { User } from "../../user/entity/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Event } from "./event.entity";
import { BaseEntity } from "../../shared/entity/base.entity";

export enum InvitationStatus {
  invited,
  rejected,
  accepted,
}

@Entity()
export class EventInvitation extends BaseEntity {
  @Column()
  status: InvitationStatus;

  @ManyToOne(() => Event, event => event.id, { onDelete: 'CASCADE' })
  event: Event;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  invitor: User;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  invitee: User;
}