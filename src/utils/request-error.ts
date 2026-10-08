import type { RequestErrorCode } from '@/types/request'

export class RequestError extends Error {
  constructor(
    message: string,
    public readonly code: RequestErrorCode,
    public readonly statusCode?: number,
  ) {
    super(message)
    this.name = 'RequestError'
  }
}
