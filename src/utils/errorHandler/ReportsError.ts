import type { ErrorKeyType, ErrorValueType } from '@/utils/errorHandler/HandlerError.ts'

export class ReportsError implements Error {
  message: string
  name: string

  constructor(message?: string, name?: string)
  constructor(message: string = '', name: string = '') {
    this.message = message
    this.name = name
  }
}

export class ReportsObjectError extends ReportsError {
  errorType?: ErrorKeyType
  errorObj?: ErrorValueType

  constructor(errorType?: ErrorKeyType, errorValue?: ErrorValueType) {
    super()
    this.errorType = errorType
    this.errorObj = errorValue
  }
}
