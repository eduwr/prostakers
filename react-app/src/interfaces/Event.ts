export enum EventType {
  DEPOSIT = "Deposit",
  WITHDRAW = "Withdraw",
}

export interface Event {
  id: number;

  type: EventType;

  from: string;

  to: string;

  amount: string;
}
