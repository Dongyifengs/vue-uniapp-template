<script setup lang="ts">
import { useStore } from '@/composables/useStore'
import { features, templateName } from '@/constants/template'
import { counterStore } from '@/stores/counter'

const count = useStore(counterStore, (state) => state.count)

function openExamples() {
  uni.navigateTo({ url: '/pages/examples/index' })
}
</script>

<template>
  <view class="page-shell">
    <view class="mb-6 rounded-3xl bg-slate-900 p-6 text-white">
      <view class="mb-5 flex items-center">
        <view class="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500">
          <text class="text-xl font-bold">U</text>
        </view>
        <text class="text-sm text-slate-300">你的下一个项目，从这里开始</text>
      </view>
      <text class="block text-2xl font-bold leading-tight">{{ templateName }}</text>
      <text class="mt-3 block text-sm leading-relaxed text-slate-300">
        一个轻量、清晰、可扩展的 uni-app 模板。专注业务，一份源码连接小程序、H5 与 App。
      </text>
      <view class="mt-5 flex flex-wrap gap-2">
        <wd-tag type="primary" variant="light" round>微信小程序</wd-tag>
        <wd-tag type="success" variant="light" round>H5</wd-tag>
        <wd-tag type="warning" variant="light" round>App</wd-tag>
      </view>
    </view>

    <demo-section title="开发基础，已经准备好了" description="从页面到测试，保持统一的开发方式。">
      <view v-for="(feature, index) in features" :key="feature.name" class="mb-4 flex items-start">
        <text class="mr-3 rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
          0{{ index + 1 }}
        </text>
        <view class="flex-1">
          <text class="block text-sm font-semibold text-slate-800">{{ feature.name }}</text>
          <text class="mt-1 block text-xs text-slate-500">{{ feature.description }}</text>
        </view>
      </view>
    </demo-section>

    <demo-section title="先体验，再开始" description="组件、共享状态和模拟请求都能在示例页中体验。">
      <view class="mb-4 flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
        <text class="text-sm text-blue-700">当前共享计数</text>
        <text class="text-2xl font-bold text-blue-700" data-testid="home-count">{{ count }}</text>
      </view>
      <wd-button block round size="large" @click="openExamples">打开功能示例</wd-button>
    </demo-section>
    <text class="block text-center text-xs text-slate-400">简单开始 · 自由扩展</text>
  </view>
</template>
