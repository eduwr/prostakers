import { Module } from '@nestjs/common';
import { WSService } from './socket.client';

@Module({
  providers: [WSService],
})
export class EventsModule {}
