import { type Subject, type Topic } from '@/events/types'

export interface ExpirationCompleteEvent {
  topic: Topic.Ticket
  subject: Subject.ExpirationComplete
  data: {
    orderId: string
  }
}
