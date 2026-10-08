import { vi } from 'vitest'

export const requestMock = vi.fn<(options: UniApp.RequestOptions) => UniApp.RequestTask>()

export function respondWith(statusCode: number, data: UniApp.RequestSuccessCallbackResult['data']) {
  requestMock.mockImplementation((options) => {
    options.success?.({
      statusCode,
      data,
      header: {},
      cookies: [],
      errMsg: 'request:ok',
    })
    return {} as UniApp.RequestTask
  })
}

export function failWith(errMsg: string) {
  requestMock.mockImplementation((options) => {
    options.fail?.({ errMsg })
    return {} as UniApp.RequestTask
  })
}
