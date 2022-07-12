import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import abi from '../abi.json';

import { EventType } from './interfaces/event-type.enum';
import { EventInfoDTO } from './interfaces/eventInfo.dto';
import { EventsService } from './events.service';

@Injectable()
export class WSService {
  readonly address = process.env.CONTRACT_ADDRESS;
  readonly url = process.env.ALCHEMY_CONTRACT_WS_URL;
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
    this.eventsService.create(payload);
  }
}
