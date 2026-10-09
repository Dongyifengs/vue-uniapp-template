export function registerMiniProgramUpdate() {
  if (typeof uni.getUpdateManager !== 'function') return

  const updateManager = uni.getUpdateManager()

  updateManager.onUpdateReady(() => {
    uni.showModal({
      title: '更新提示',
      content: '新版本已准备好，点击立即重启以使用最新版本。',
      showCancel: false,
      confirmText: '立即重启',
      success: ({ confirm }) => {
        if (confirm) updateManager.applyUpdate()
      },
    })
  })

  updateManager.onUpdateFailed(() => {
    uni.showModal({
      title: '更新失败',
      content: '新版本下载失败，请检查网络后重新打开小程序重试。',
      showCancel: false,
    })
  })
}
