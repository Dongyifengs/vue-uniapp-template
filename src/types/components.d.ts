import DemoSection from '@/components/demo-section/demo-section.vue'

declare module 'vue' {
  export interface GlobalComponents {
    DemoSection: typeof DemoSection
  }
}

export {}
