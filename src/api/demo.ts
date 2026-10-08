import type { DemoItem } from '@/types/demo'
import { request } from '@/utils/request'

export function getDemoItems(fail = false) {
  return request<DemoItem[]>({ url: fail ? '/demo/error' : '/demo/items', method: 'GET' })
}
