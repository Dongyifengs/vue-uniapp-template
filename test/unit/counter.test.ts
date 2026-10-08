import { describe, expect, it } from 'vitest'
import { createCounterStore } from '@/stores/counter'

describe('counter store', () => {
  it('增加、减少、重置计数，并保留 action', () => {
    const store = createCounterStore()
    store.getState().increment()
    store.getState().increment()
    store.getState().decrement()
    expect(store.getState().count).toBe(1)
    store.getState().reset()
    expect(store.getState().count).toBe(0)
    store.getState().increment()
    expect(store.getState().count).toBe(1)
  })

  it('工厂生成互相隔离的 Store', () => {
    const first = createCounterStore()
    const second = createCounterStore()
    first.getState().increment()
    expect(second.getState().count).toBe(0)
  })
})
