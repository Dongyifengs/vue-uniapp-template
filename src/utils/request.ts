import { env } from '@/config/env'
import type { RequestOptions } from '@/types/request'
import { RequestError } from './request-error'

export { RequestError } from './request-error'

/** 返回 response.data；业务响应结构由调用方的 T 描述。 */
export async function request<T>(options: RequestOptions): Promise<T> {
  const timeout = options.timeout ?? 10_000

  // DEV 是构建期常量，生产构建会移除 Mock 模块及其数据。
  if (import.meta.env.DEV && env.useMock) {
    const { mockRequest } = await import('@/mock')
    return mockRequest<T>({ ...options, timeout })
  }

  let url = options.url
  if (!/^https?:\/\//i.test(url)) {
    if (!/^https?:\/\//i.test(env.apiBaseUrl)) {
      throw new RequestError('请先配置 VITE_API_BASE_URL 为完整的 HTTP(S) 接口地址', 'CONFIG')
    }
    url = `${env.apiBaseUrl.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`
  }

  return new Promise<T>((resolve, reject) => {
    uni.request({
      ...options,
      url,
      timeout,
      success(response) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(response.data as T)
        } else {
          reject(
            new RequestError(`请求失败：HTTP ${response.statusCode}`, 'HTTP', response.statusCode),
          )
        }
      },
      fail(error) {
        const timedOut = /timeout/i.test(error.errMsg)
        reject(
          new RequestError(
            timedOut ? '请求超时，请稍后重试' : error.errMsg || '网络连接失败',
            timedOut ? 'TIMEOUT' : 'NETWORK',
          ),
        )
      },
    })
  })
}
