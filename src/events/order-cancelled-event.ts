import { type Subject, type Topic } from '@/events/types'

export interface OrderCancelledEvent {
  topic: Topic.Ticket
  subject: Subject.OrderCancelled
  data: {
    id: string
    ticket: {
      id: string
    }
    version: number
  }
}
