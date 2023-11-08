export interface Event {
  topic: Topic
  subject: Subject
  data: object
}

export enum Topic {
  Ticket = 'ticket'
}

export enum Subject {
  TicketCreated = 'ticket.created',
  TicketUpdated = 'ticket.updated',
  OrderUpdated = 'order.updated'
}

// Order
export enum OrderStatus {
  // when the order has been created, but the ticket
  // is trying to order has not been reserved
  Created = 'created',

  // the ticket the order trying to reserve has already been reserved
  // or when the user has cancelled the order
  // or the order expires before payment
  Cancelled = 'cancelled',

  // the order has successfully reserved the ticket
  AwaitingPayment = 'awaiting:payment',

  // the order has reserved and the user has provided payment successfully
  Complete = 'complete'
}
