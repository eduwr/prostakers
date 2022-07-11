import { EventType } from '../event-type.enum';

export interface EventInfoDTO {
  type: EventType;

  from: string;

  to: string;

  amount: string;
}
