import { getCurrentScope, onScopeDispose, shallowReadonly, shallowRef } from 'vue'
import type { StoreApi } from 'zustand/vanilla'

/** 在 setup/effectScope 中订阅 Zustand；离开作用域时自动取消订阅。 */
export function useStore<State, Selected>(
  store: StoreApi<State>,
  selector: (state: State) => Selected,
) {
  if (!getCurrentScope()) {
    throw new Error('useStore 必须在 Vue setup 或 effectScope 中调用')
  }

  const selected = shallowRef<Selected>(selector(store.getState()))
  const unsubscribe = store.subscribe((state) => {
    const next = selector(state)
    if (!Object.is(selected.value, next)) selected.value = next
  })
  onScopeDispose(unsubscribe)

  return shallowReadonly(selected)
}
