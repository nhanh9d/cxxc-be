import { CreateEventRuleDto } from "./event-rule.create.dto";

export class EventDto {
  name: string;
  banner: string;
  startDate: Date;
  endDate: Date;
  startLocation: string;
  description?: string;
  size: number;
  rules?: CreateEventRuleDto[];
}

export class RegisterEventDto {
  id: number;
}

export class EditEventDto extends EventDto {
  id: number;
}