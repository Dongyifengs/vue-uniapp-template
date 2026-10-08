import { createStore } from 'zustand/vanilla'

export interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

// 工厂便于测试或隔离实例；应用页面共享下面的单例。
export function createCounterStore() {
  return createStore<CounterState>()((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    reset: () => set({ count: 0 }),
  }))
}

export const counterStore = createCounterStore()
