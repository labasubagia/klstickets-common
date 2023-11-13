import { type Subject, type Topic } from '@/events/types'

export interface PaymentCreatedEvent {
  topic: Topic.Ticket
  subject: Subject.PaymentCreated
  data: {
    id: string
    orderId: string
    stripeId: number
  }
}
