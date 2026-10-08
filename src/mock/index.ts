import type { RequestOptions } from '@/types/request'
import { RequestError } from '@/utils/request-error'
import { demoItems } from './data'

const delay = 400

export async function mockRequest<T>(options: RequestOptions): Promise<T> {
  const timeout = options.timeout ?? 10_000
  await new Promise((resolve) => setTimeout(resolve, Math.min(delay, timeout)))
  if (timeout < delay) throw new RequestError('请求超时，请稍后重试', 'TIMEOUT')

  const method = options.method ?? 'GET'
  if (method === 'GET' && options.url === '/demo/items') {
    return demoItems.map((item) => ({ ...item })) as T
  }
  if (method === 'GET' && options.url === '/demo/error') {
    throw new RequestError('Mock：模拟服务异常，请重试', 'HTTP', 500)
  }
  throw new RequestError(`Mock：未定义 ${method} ${options.url}`, 'HTTP', 404)
}
