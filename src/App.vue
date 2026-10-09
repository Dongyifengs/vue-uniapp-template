<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
// #ifdef MP-WEIXIN
import { registerMiniProgramUpdate } from './utils/mini-program-update'
// #endif

onLaunch(() => {
  // #ifdef MP-WEIXIN
  registerMiniProgramUpdate()
  // #endif
})
</script>

<style>
@import './styles/tailwind.css';
@import './styles/global.css';
</style>

<style lang="scss">
@use '@wot-ui/ui/styles/theme/index.scss' as *;
</style>
