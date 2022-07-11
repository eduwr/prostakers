import { Module } from '@nestjs/common';
import { WSService } from './socket.client';
import { Event } from './event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [WSService, EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
