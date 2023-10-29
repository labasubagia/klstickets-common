import { type Request as ExpressRequest } from 'express'

import { type UserPayload } from '@/middlewares/current-user'

declare module 'express' {
  interface Request extends ExpressRequest {
    currentUser?: UserPayload
  }
}
