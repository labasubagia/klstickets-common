import { CustomError, type CustomErrorItem } from '@/errors/custom-error'

export class BadRequestError extends CustomError {
  statusCode = 400

  constructor(public message: string) {
    super(message)
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }

  serializeErrors(): CustomErrorItem[] {
    return [{ message: this.message }]
  }
}
