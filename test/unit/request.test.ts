import { describe, expect, it, vi } from 'vitest'
import { failWith, requestMock, respondWith } from '../mocks/uni'

describe('request', () => {
  it('拼接基础地址，转发请求参数并返回响应数据', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com/v1/')
    respondWith(200, { id: 1 })
    const { request } = await import('@/utils/request')
    await expect(
      request({ url: '/items', method: 'POST', data: { title: '示例' }, timeout: 3000 }),
    ).resolves.toEqual({ id: 1 })
    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://api.example.com/v1/items',
        method: 'POST',
        data: { title: '示例' },
        timeout: 3000,
      }),
    )
  })

  it('支持完整 URL 和默认超时', async () => {
    respondWith(201, { ok: true })
    const { request } = await import('@/utils/request')
    await request({ url: 'https://api.example.com/items' })
    expect(requestMock).toHaveBeenCalledWith(expect.objectContaining({ timeout: 10_000 }))
  })

  it('未配置真实接口时明确报错，不发送请求', async () => {
    const { request } = await import('@/utils/request')
    await expect(request({ url: '/items' })).rejects.toMatchObject({ code: 'CONFIG' })
    expect(requestMock).not.toHaveBeenCalled()
  })

  it('非 2xx 响应作为 HTTP 错误抛出', async () => {
    respondWith(500, { message: '失败' })
    const { request } = await import('@/utils/request')
    await expect(request({ url: 'https://api.example.com/items' })).rejects.toMatchObject({
      code: 'HTTP',
      statusCode: 500,
    })
  })

  it.each([
    ['request:fail timeout', 'TIMEOUT'],
    ['request:fail connection refused', 'NETWORK'],
  ])('处理网络失败：%s', async (message, code) => {
    failWith(message)
    const { request } = await import('@/utils/request')
    await expect(request({ url: 'https://api.example.com/items' })).rejects.toMatchObject({ code })
  })

  it('开发 Mock 开启后不调用 uni.request', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'true')
    const { request } = await import('@/utils/request')
    const result = await request<unknown[]>({ url: '/demo/items' })
    expect(result).toHaveLength(3)
    expect(requestMock).not.toHaveBeenCalled()
  })

  it('生产环境即使配置 Mock=true 也使用真实接口', async () => {
    vi.stubEnv('DEV', false)
    vi.stubEnv('VITE_USE_MOCK', 'true')
    respondWith(200, ['真实接口'])
    const { request } = await import('@/utils/request')
    await expect(request({ url: 'https://api.example.com/items' })).resolves.toEqual(['真实接口'])
    expect(requestMock).toHaveBeenCalledOnce()
  })

  it('Mock 支持失败和未知路由反馈', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'true')
    const { request } = await import('@/utils/request')
    await expect(request({ url: '/demo/error' })).rejects.toMatchObject({
      code: 'HTTP',
      statusCode: 500,
    })
    await expect(request({ url: '/missing' })).rejects.toMatchObject({
      code: 'HTTP',
      statusCode: 404,
    })
  })

  it('Mock 遵守调用方的超时参数', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'true')
    const { request } = await import('@/utils/request')
    await expect(request({ url: '/demo/items', timeout: 1 })).rejects.toMatchObject({
      code: 'TIMEOUT',
    })
  })
})
