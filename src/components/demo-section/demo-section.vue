<script setup lang="ts">
defineOptions({ options: { styleIsolation: 'shared' } })
defineProps<{ title: string; description?: string }>()
</script>

<template>
  <view class="mb-5 rounded-2xl border border-slate-100 bg-white p-5">
    <text class="block text-base font-semibold text-slate-900">{{ title }}</text>
    <text v-if="description" class="mt-1 block text-sm text-slate-500">{{ description }}</text>
    <view class="mt-4">
      <slot />
    </view>
  </view>
</template>
