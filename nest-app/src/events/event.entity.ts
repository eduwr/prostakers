export class Event {
  type: 'Deposit' | 'Withdraw';
  from: string;
  to: string;
  amount: string;
}
