import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { EventRule } from "./event-rule.entity";
import { BaseEntity } from "../../shared/entity/base.entity";
import { User } from "../../user/entity/user.entity";
import { EventMember } from "./event-member.entity";
import { EventInvitation } from "./event-invitation.entity";

export enum EventStatus {
  opened,
  finished,
  cancelled
}

@Entity()
export class Event extends BaseEntity {
  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  banner: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  startLocation: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  size?: number;

  @Column({ type: "enum", enum: EventStatus, default: EventStatus.opened })
  status?: EventStatus;

  @ManyToOne(() => User, user => user.createdEvents, { onDelete: 'CASCADE' })
  creator: User;

  @OneToMany(() => EventMember, member => member.event)
  members: EventMember[];

  @OneToMany(() => EventRule, rule => rule.event)
  rules: EventRule[];

  @OneToMany(() => EventInvitation, invitation => invitation.event)
  invitations: EventInvitation[];
}