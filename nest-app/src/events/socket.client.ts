import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import abi from '../abi.json';

import { EventType } from './interfaces/event-type.enum';
import { EventInfoDTO } from './interfaces/eventInfo.dto';
import { EventsService } from './events.service';

@Injectable()
export class WSService {
  readonly address = '0x9366dBd2e0B524Aea00127011005e7274f29911A';
  readonly url =
    'wss://eth-rinkeby.alchemyapi.io/v2/eNqEUwONIDu5dx9HV8EarSZiVb7P-OW9';
  private contract;

  constructor(private eventsService: EventsService) {
    const provider = new ethers.providers.WebSocketProvider(this.url);
    this.contract = new ethers.Contract(this.address, abi.abi, provider);

    this.contract.on(EventType.DEPOSIT, (from, to, amount) => {
      const info: EventInfoDTO = {
        type: EventType.DEPOSIT,
        from,
        to,
        amount: ethers.utils.formatEther(amount),
      };
      console.log(info);
      this.persistEvent(info);
    });

    this.contract.on(EventType.WITHDRAW, (from, to, amount) => {
      const info: EventInfoDTO = {
        type: EventType.WITHDRAW,
        from,
        to,
        amount: ethers.utils.formatEther(amount),
      };
      console.log(info);

      this.persistEvent(info);
    });
  }

  persistEvent(payload: EventInfoDTO) {
    return this.eventsService.create(payload);
  }
}
