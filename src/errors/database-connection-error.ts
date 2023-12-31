import { CustomError, type CustomErrorItem } from '@/errors/custom-error'

export class DatabaseConnectionError extends CustomError {
  statusCode = 500
  reason = 'Error connecting to database'

  constructor() {
    super('Error connecting to database')
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors(): CustomErrorItem[] {
    return [{ message: this.reason }]
  }
}
