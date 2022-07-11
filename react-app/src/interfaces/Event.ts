export enum EventType {
  DEPOSIT = "Deposit",
  WITHDRAW = "Withdraw",
}

export interface IEvent {
  id: number;

  type: EventType;

  from: string;

  to: string;

  amount: string;
}
