import { Controller, Get, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventType } from './interfaces/event-type.enum';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  async index(
    @Query('address') address: string | undefined,
    @Query('type') type: EventType | undefined,
  ) {
    console.log({ type });
    console.log({ address });
    return await this.eventsService.findEvents(address, type);
  }
}
