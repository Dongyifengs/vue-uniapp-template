import { getCurrentScope, onScopeDispose, shallowReadonly, shallowRef } from 'vue'

export function useRequest<Data, Args extends unknown[]>(
  service: (...args: Args) => Promise<Data>,
) {
  const data = shallowRef<Data>()
  const loading = shallowRef(false)
  const error = shallowRef<Error>()
  let requestId = 0

  if (getCurrentScope()) onScopeDispose(() => requestId++)

  async function execute(...args: Args): Promise<Data> {
    const currentId = ++requestId
    loading.value = true
    error.value = undefined
    try {
      const result = await service(...args)
      if (currentId === requestId) data.value = result
      return result
    } catch (cause) {
      const failure = cause instanceof Error ? cause : new Error(String(cause))
      if (currentId === requestId) error.value = failure
      throw failure
    } finally {
      if (currentId === requestId) loading.value = false
    }
  }

  return {
    data: shallowReadonly(data),
    loading: shallowReadonly(loading),
    error: shallowReadonly(error),
    execute,
  }
}
