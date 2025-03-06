import { BaseEntity } from "src/shared/entity/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class EventRule extends BaseEntity {
  @Column()
  name: string;

  @Column()
  icon: string;

  @Column()
  eventId: number;
}