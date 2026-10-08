import { effectScope } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useRequest } from '@/composables/useRequest'

describe('useRequest', () => {
  it('转发参数并管理加载状态、数据', async () => {
    const service = vi.fn(async (id: number) => ({ id }))
    const request = useRequest(service)
    const pending = request.execute(3)
    expect(request.loading.value).toBe(true)
    await expect(pending).resolves.toEqual({ id: 3 })
    expect(service).toHaveBeenCalledWith(3)
    expect(request.data.value).toEqual({ id: 3 })
    expect(request.loading.value).toBe(false)
  })

  it('记录错误并继续向调用方抛出，下一次请求清除错误', async () => {
    const service = vi.fn<() => Promise<string>>()
    service.mockRejectedValueOnce(new Error('服务不可用')).mockResolvedValueOnce('恢复正常')
    const request = useRequest(service)
    await expect(request.execute()).rejects.toThrow('服务不可用')
    expect(request.error.value?.message).toBe('服务不可用')
    expect(request.loading.value).toBe(false)
    await request.execute()
    expect(request.error.value).toBeUndefined()
    expect(request.data.value).toBe('恢复正常')
  })

  it('较晚返回的旧请求不会覆盖最新数据', async () => {
    let completeFirst!: (result: string) => void
    const service = vi
      .fn<() => Promise<string>>()
      .mockImplementationOnce(() => new Promise((resolve) => (completeFirst = resolve)))
      .mockResolvedValueOnce('最新结果')
    const request = useRequest(service)
    const first = request.execute()
    await request.execute()
    completeFirst('旧结果')
    await first
    expect(request.data.value).toBe('最新结果')
  })

  it('作用域销毁后忽略未完成请求的状态更新', async () => {
    let complete!: (result: string) => void
    const scope = effectScope()
    const request = scope.run(() =>
      useRequest(() => new Promise<string>((resolve) => (complete = resolve))),
    )!
    const pending = request.execute()
    scope.stop()
    complete('已销毁')
    await pending
    expect(request.data.value).toBeUndefined()
  })
})
