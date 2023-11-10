import {
  AckPolicy,
  DeliverPolicy,
  ErrorCode,
  type JsMsg,
  type NatsConnection,
  type NatsError
} from 'nats'

import { type Event } from '@/events/types'

export abstract class Consumer<T extends Event> {
  abstract topic: T['topic']
  abstract subject: T['subject']
  abstract queueGroupName: string
  abstract failRetryWaitMs: number

  abstract onMessage(message: JsMsg, data: T['data']): Promise<void>

  constructor(private readonly client: NatsConnection) {}

  async init(): Promise<this> {
    const jsm = await this.client.jetstreamManager()

    const stream = await jsm.streams.get(this.topic).catch(async (error) => {
      const isNotFound =
        (error as NatsError)?.code === ErrorCode.JetStream404NoMessages
      if (isNotFound) {
        // add stream
        await jsm.streams.add({
          name: this.topic,
          subjects: [this.subject]
        })
      } else {
        console.error(error)
      }
    })

    if (stream != null) {
      // update stream
      const streamInfo = await stream.info()
      if (!streamInfo.config.subjects.includes(this.subject)) {
        streamInfo.config.subjects?.push(this.subject)
        await jsm.streams.update(this.topic, streamInfo.config)
      }
    }

    // add consumer
    await jsm.consumers.add(this.topic, {
      durable_name: this.queueGroupName,
      deliver_policy: DeliverPolicy.All,
      ack_policy: AckPolicy.Explicit,
      filter_subject: this.subject
    })
    return this
  }

  async consume(): Promise<void> {
    const js = this.client.jetstream()
    const consumer = await js.consumers.get(this.topic, this.queueGroupName)
    const messages = await consumer.consume()
    for await (const message of messages) {
      console.log(
        `event received: ${this.queueGroupName} -> ${this.topic}/${this.subject}`
      )
      const decoded = message.json()
      try {
        await this.onMessage(message, decoded as T['data'])
        message.ack()
      } catch (error) {
        console.error(
          `Error consume msg ${message.seq} with error: ${
            (error as Error).message
          } and payload ${JSON.stringify(decoded)}, retry in ${
            this.failRetryWaitMs
          }`
        )
        message.nak(this.failRetryWaitMs)
      }
    }
  }
}
