import { CustomError, type CustomErrorItem } from '@/errors/custom-error'

export class NotFoundError extends CustomError {
  statusCode = 404

  constructor() {
    super('Route not found')
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors(): CustomErrorItem[] {
    return [{ message: 'Not Found' }]
  }
}
