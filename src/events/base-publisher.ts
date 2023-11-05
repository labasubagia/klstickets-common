import type { NatsConnection, NatsError, PubAck } from 'nats'
import { ErrorCode, StringCodec } from 'nats'

import { type Event } from './types'

export abstract class Publisher<T extends Event> {
  abstract topic: T['topic']
  abstract subject: T['subject']
  private readonly stringCodec = StringCodec()

  constructor(private readonly client: NatsConnection) {}

  async init(): Promise<this> {
    const jsm = await this.client.jetstreamManager()

    const stream = await jsm.streams.get(this.topic).catch(async (error) => {
      const isNotFound =
        (error as NatsError)?.code === ErrorCode.JetStream404NoMessages
      if (isNotFound) {
        await jsm.streams.add({
          name: this.topic,
          subjects: [this.subject]
        })
      } else {
        console.error(error)
      }
    })

    if (stream != null) {
      const streamInfo = await stream.info()
      const hasSubject = streamInfo.config.subjects.includes(this.subject)
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!hasSubject) {
        streamInfo.config.subjects?.push(this.subject)
        await jsm.streams.update(this.topic, streamInfo.config)
      }
    }

    return this
  }

  async publish(payload: T['data']): Promise<PubAck> {
    const js = this.client.jetstream()
    return js.publish(
      this.subject,
      this.stringCodec.encode(JSON.stringify(payload))
    )
  }
}
