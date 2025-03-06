import { BaseEntity } from "src/shared/entity/base.entity";
import { Column, Entity } from "typeorm";

export enum InvitationStatus {
  invited,
  rejected,
  accepted,
}

@Entity()
export class EventInvitation extends BaseEntity {
  @Column()
  status: InvitationStatus;

  @Column()
  eventId: number;

  @Column()
  userId: number;
}