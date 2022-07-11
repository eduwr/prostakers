import { Module } from '@nestjs/common';
import { WSService } from './socket.client';
import { Event } from './event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [WSService],
})
export class EventsModule {}
