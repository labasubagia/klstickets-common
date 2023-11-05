import { type Subject, type Topic } from './types'

export interface TicketCreatedEvent {
  topic: Topic.Ticket
  subject: Subject.TicketCreated
  data: {
    id: string
    title: string
    price: number
    userId: string
  }
}
