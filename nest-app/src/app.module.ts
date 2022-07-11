import { Module } from '@nestjs/common';

import { EventsModule } from './events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './events/event.entity';

@Module({
  imports: [
    EventsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: [Event],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
