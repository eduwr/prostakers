import { Module } from '@nestjs/common';

import { EventsModule } from './events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './events/event.entity';
import { ConfigModule } from "@nestjs/config";
import { EthersModule } from './ethers/ethers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: [Event],
      synchronize: true,
    }),
    EthersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
