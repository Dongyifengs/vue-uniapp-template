import { effectScope, isReadonly } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useStore } from '@/composables/useStore'
import { createCounterStore } from '@/stores/counter'

describe('useStore', () => {
  it('两个作用域共享数据，销毁后停止更新', () => {
    const store = createCounterStore()
    const firstScope = effectScope()
    const secondScope = effectScope()
    const first = firstScope.run(() => useStore(store, (state) => state.count))!
    const second = secondScope.run(() => useStore(store, (state) => state.count))!
    expect(isReadonly(first)).toBe(true)

    store.getState().increment()
    expect(first.value).toBe(1)
    expect(second.value).toBe(1)

    firstScope.stop()
    store.getState().increment()
    expect(first.value).toBe(1)
    expect(second.value).toBe(2)
    secondScope.stop()
  })

  it('作用域销毁时真正取消 Store 订阅', () => {
    const store = createCounterStore()
    const unsubscribe = vi.fn()
    vi.spyOn(store, 'subscribe').mockReturnValue(unsubscribe)
    const scope = effectScope()
    scope.run(() => useStore(store, (state) => state.count))
    scope.stop()
    expect(unsubscribe).toHaveBeenCalledOnce()
  })

  it('要求调用方提供有效的 Vue 作用域', () => {
    expect(() => useStore(createCounterStore(), (state) => state.count)).toThrow('setup')
  })
})
