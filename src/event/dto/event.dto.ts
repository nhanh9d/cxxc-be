import { CreateEventRuleDto } from "./event-rule.create.dto";
import { UserDto } from "../../user/dto/user.dto";
import { MemberStatus, RoleType } from "../entity/event-member.entity";

export interface EventMemberDto {
  id: number;
  status: MemberStatus;
  memberRole: RoleType;
  user: UserDto;
}

export class EventDto {
  id?: number;
  name: string;
  banner: string;
  startDate: Date;
  endDate: Date;
  startLocation: string;
  description?: string;
  size?: number;
  rules?: CreateEventRuleDto[];
  creator?: UserDto;
  members?: EventMemberDto[];
}

export class RegisterEventDto {
  id: number;
}

export class EditEventDto extends EventDto {
  id: number;
}