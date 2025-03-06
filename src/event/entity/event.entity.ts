import { BaseEntity } from "src/shared/entity/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { EventRule } from "./event-rule.entity";

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

  @Column()
  size: number;

  @Column({ type: "enum", enum: EventStatus, default: EventStatus.opened })
  status: EventStatus;

  @OneToMany(() => EventRule, rule => rule.eventId)
  rules: EventRule[];
}