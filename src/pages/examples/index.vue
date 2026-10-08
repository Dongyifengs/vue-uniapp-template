<script setup lang="ts">
import { useToast } from '@wot-ui/ui'
import { getDemoItems } from '@/api/demo'
import { useRequest } from '@/composables/useRequest'
import { useStore } from '@/composables/useStore'
import { env } from '@/config/env'
import { counterStore } from '@/stores/counter'
import { formatDateTime } from '@/utils/format'

const toast = useToast()
const count = useStore(counterStore, (state) => state.count)
const { data, loading, error, execute } = useRequest(getDemoItems)
const { increment, decrement, reset } = counterStore.getState()

async function loadItems(fail = false) {
  try {
    await execute(fail)
    toast.success('数据加载成功')
  } catch (cause) {
    toast.error(cause instanceof Error ? cause.message : '请求失败')
  }
}
</script>

<template>
  <view class="page-shell">
    <view class="mb-6">
      <text class="block text-2xl font-bold text-slate-900">让模板跑起来</text>
      <text class="mt-2 block text-sm text-slate-500">试试下面的交互，感受完整的开发链路。</text>
    </view>

    <demo-section
      title="01 / Wot UI 组件"
      description="按钮、标签与消息提示通过 easycom 自动引入。"
    >
      <view class="mb-4 flex flex-wrap gap-2">
        <wd-tag type="primary" variant="light">自动引入</wd-tag>
        <wd-tag type="success" variant="plain">TypeScript</wd-tag>
      </view>
      <wd-button variant="soft" block @click="toast.success('Wot UI 已就绪')"
        >显示成功提示</wd-button
      >
    </demo-section>

    <demo-section title="02 / Zustand 共享状态" description="返回首页后，计数仍然保持同步。">
      <view class="mb-4 rounded-xl bg-slate-50 py-5 text-center">
        <text class="block text-4xl font-bold text-slate-900" data-testid="counter">{{
          count
        }}</text>
        <text class="mt-1 block text-xs text-slate-400">共享计数器</text>
      </view>
      <view class="flex items-center justify-center gap-3">
        <wd-button variant="plain" @click="decrement">−1</wd-button>
        <wd-button @click="increment">+1</wd-button>
        <wd-button type="info" variant="text" @click="reset">重置</wd-button>
      </view>
    </demo-section>

    <demo-section title="03 / Tailwind 布局" description="直接使用原子类，样式自动适配目标平台。">
      <view class="grid grid-cols-3 gap-3">
        <view class="rounded-xl bg-blue-50 py-5 text-center text-sm font-semibold text-blue-600"
          >布局</view
        >
        <view
          class="rounded-xl bg-emerald-50 py-5 text-center text-sm font-semibold text-emerald-600"
          >间距</view
        >
        <view class="rounded-xl bg-amber-50 py-5 text-center text-sm font-semibold text-amber-600"
          >色彩</view
        >
      </view>
    </demo-section>

    <demo-section title="04 / 请求与 Mock" description="包含加载状态、成功响应和失败反馈。">
      <view class="mb-4">
        <wd-tag :type="env.useMock ? 'success' : 'primary'" variant="light">
          {{ env.useMock ? '开发 Mock 已开启' : '正在使用真实接口' }}
        </wd-tag>
      </view>
      <view class="flex gap-3">
        <wd-button :loading="loading" @click="loadItems()">加载数据</wd-button>
        <wd-button variant="plain" type="danger" :disabled="loading" @click="loadItems(true)"
          >模拟失败</wd-button
        >
      </view>
      <text v-if="error" class="mt-4 block rounded-lg bg-red-50 p-3 text-sm text-red-600">{{
        error.message
      }}</text>
      <view v-for="item in data" :key="item.id" class="mt-4 border-t border-slate-100 pt-4">
        <text class="block text-sm font-semibold text-slate-800">{{ item.title }}</text>
        <text class="mt-1 block text-xs text-slate-500">{{ item.description }}</text>
        <text class="mt-2 block text-xs text-slate-400">{{ formatDateTime(item.updatedAt) }}</text>
      </view>
    </demo-section>
    <wd-toast />
  </view>
</template>
