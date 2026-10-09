import { describe, expect, it, vi } from 'vitest'
import { registerMiniProgramUpdate } from '@/utils/mini-program-update'

describe('小程序版本更新', () => {
  it('无更新时保持安静，新版本就绪并确认后重启应用', () => {
    const applyUpdate = vi.fn()
    const showModal = vi.fn()
    let onUpdateReady!: () => void
    const onUpdateFailed = vi.fn()
    vi.stubGlobal('uni', {
      getUpdateManager: () => ({
        onUpdateReady: (callback: () => void) => (onUpdateReady = callback),
        onUpdateFailed,
        applyUpdate,
      }),
      showModal,
    })

    registerMiniProgramUpdate()
    expect(onUpdateFailed).toHaveBeenCalledOnce()
    expect(showModal).not.toHaveBeenCalled()

    onUpdateReady()
    const options = showModal.mock.calls[0][0]
    expect(options).toMatchObject({ showCancel: false, confirmText: '立即重启' })
    expect(applyUpdate).not.toHaveBeenCalled()
    options.success({ confirm: false })
    expect(applyUpdate).not.toHaveBeenCalled()
    options.success({ confirm: true })
    expect(applyUpdate).toHaveBeenCalledOnce()
  })

  it('下载失败时提示重新打开小程序，不触发重启', () => {
    const applyUpdate = vi.fn()
    const showModal = vi.fn()
    let onUpdateFailed!: () => void
    vi.stubGlobal('uni', {
      getUpdateManager: () => ({
        onUpdateReady: vi.fn(),
        onUpdateFailed: (callback: () => void) => (onUpdateFailed = callback),
        applyUpdate,
      }),
      showModal,
    })

    registerMiniProgramUpdate()
    onUpdateFailed()
    expect(showModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '更新失败',
        content: expect.stringContaining('重新打开小程序'),
        showCancel: false,
      }),
    )
    expect(applyUpdate).not.toHaveBeenCalled()
  })

  it('不支持更新管理器时跳过', () => {
    const showModal = vi.fn()
    vi.stubGlobal('uni', { showModal })

    expect(() => registerMiniProgramUpdate()).not.toThrow()
    expect(showModal).not.toHaveBeenCalled()
  })
})
