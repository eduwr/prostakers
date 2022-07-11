import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import abi from '../abi.json';
import { Event } from './event.entity';

@Injectable()
export class WSService {
  readonly address = '0x9366dBd2e0B524Aea00127011005e7274f29911A';
  readonly url =
    'wss://eth-rinkeby.alchemyapi.io/v2/eNqEUwONIDu5dx9HV8EarSZiVb7P-OW9';
  private contract;

  constructor() {
    const provider = new ethers.providers.WebSocketProvider(this.url);
    this.contract = new ethers.Contract(this.address, abi.abi, provider);

    this.contract.on('Deposit', (from, to, amount) => {
      const info: Event = {
        type: 'Deposit',
        from,
        to,
        amount: ethers.utils.formatEther(amount),
      };
      console.log(info);
      this.handleDeposit(info);
    });

    this.contract.on('Withdraw', (from, to, amount) => {
      const info: Event = {
        type: 'Withdraw',
        from,
        to,
        amount: ethers.utils.formatEther(amount),
      };
      console.log(info);

      this.handleWithdraw(info);
    });
  }

  handleDeposit(payload: Event) {}

  handleWithdraw(payload: Event) {}
}
