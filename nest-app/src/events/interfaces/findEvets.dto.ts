import { EventType } from './event-type.enum';

export interface FindEventsDTO {
  address?: string;
  type?: EventType;
  skip: string;
  limit: string;
}
