import { describe, expect, it } from 'vitest'
import { formatDateTime } from '@/utils/format'

describe('formatDateTime', () => {
  it('按本地时区格式化并补齐月份、日期和时间', () => {
    const date = new Date(2026, 0, 2, 3, 4)
    expect(formatDateTime(date)).toBe('2026-01-02 03:04')
    expect(formatDateTime(date.getTime())).toBe('2026-01-02 03:04')
    expect(formatDateTime(date.toISOString())).toBe('2026-01-02 03:04')
  })

  it('无效日期显示占位符', () => {
    expect(formatDateTime('invalid')).toBe('--')
  })
})
