import { type OrderStatus, type Subject, type Topic } from '@/events/types'

export interface OrderCreatedEvent {
  topic: Topic.Ticket
  subject: Subject.OrderCreated
  data: {
    id: string
    status: OrderStatus
    userId: string
    expiresAt: string
    ticket: {
      id: string
      price: number
    }
    version: number
  }
}
