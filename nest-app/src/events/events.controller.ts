import { Controller, Get, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { FindEventsDTO } from './interfaces/findEvets.dto';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  async index(@Query() findEvents: FindEventsDTO) {
    return await this.eventsService.findEvents(findEvents);
  }
}
