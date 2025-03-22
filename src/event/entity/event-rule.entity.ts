import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "../../shared/entity/base.entity";
import { Event } from "./event.entity";

@Entity()
export class EventRule extends BaseEntity {
  @Column()
  name: string;

  @Column()
  icon: string;

  @ManyToOne(() => Event, event => event.rules, { onDelete: 'CASCADE' })
  event: Event;
}