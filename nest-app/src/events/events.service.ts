import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { EventInfoDTO } from './interfaces/eventInfo.dto';
import { EventType } from './interfaces/event-type.enum';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
  ) {}

  async create(info: EventInfoDTO) {
    const event = new Event();
    const { from, to, type, amount } = info;

    if (!from || !to || !type || !amount) {
      throw new BadRequestException();
    }

    event.from = from;
    event.to = to;
    event.type = type;
    event.amount = amount;

    try {
      await this.eventRepository.save(event);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async findEvents(address: string, type: EventType) {
    const typeQuery = type ? { type } : {};
    try {
      if (!address) {
        return await this.eventRepository.find({ where: typeQuery });
      }

      return await this.eventRepository.find({
        where: [
          {
            from: address,
            ...typeQuery,
          },
          {
            to: address,
            ...typeQuery,
          },
        ],
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
