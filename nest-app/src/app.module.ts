import { Module } from '@nestjs/common';

import { EventsModule } from './events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './events/event.entity';
import { ConfigModule } from "@nestjs/config";
import { EthersModule } from './ethers/ethers.module';
import abi from './abi.json'
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
    EthersModule.forRoot({
      abi: abi.abi,
      url: process.env.ALCHEMY_CONTRACT_ADDRESS || '',
      address: process.env.CONTRACT_ADDRESS || ''
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
