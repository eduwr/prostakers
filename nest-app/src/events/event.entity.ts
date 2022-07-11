import { EventType } from './event-type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: EventType;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  amount: string;
}
