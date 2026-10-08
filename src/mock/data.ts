import type { DemoItem } from '@/types/demo'

export const demoItems: DemoItem[] = [
  {
    id: 1,
    title: '组件即写即用',
    description: 'Wot UI 通过 easycom 按需引入，直接在模板中使用 wd-* 组件。',
    updatedAt: '2026-10-08T08:00:00+08:00',
  },
  {
    id: 2,
    title: '状态在页面间共享',
    description: 'Zustand vanilla Store 配合 Vue 组合式函数，更新后自动刷新界面。',
    updatedAt: '2026-10-08T09:30:00+08:00',
  },
  {
    id: 3,
    title: '一份源码，多端构建',
    description: '同一套页面可以编译到微信小程序、H5 和 App。',
    updatedAt: '2026-10-08T10:00:00+08:00',
  },
]
