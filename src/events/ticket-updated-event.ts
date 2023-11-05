import { type Subject, type Topic } from './types'

export interface TicketUpdatedEvent {
  topic: Topic.Ticket
  subject: Subject.TicketUpdated
  data: {
    id: string
    title: string
    price: number
    userId: string
  }
}
