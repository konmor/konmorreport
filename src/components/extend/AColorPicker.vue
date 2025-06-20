<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import ColorPicker from '@/components/extend/ColorPicker.vue'

let { color } = defineProps(['color'])

// 声明事件
const emit = defineEmits(['update:color'])

let openColorSelector = ref(false)

const openColorPicker = (e: any) => {
  openColorSelector.value = true
}

const getColor = (currentColor: string) => {
  // 触发事件
  emit('update:color', currentColor)
}
</script>

<template>
  <a-popover trigger="click" placement="bottom" class="color-picker">
    <template #content>
      <ColorPicker :color="color" :setColor="getColor" v-if="openColorSelector"></ColorPicker>
    </template>
    <div
      style="width: 24px; height: 24px; padding: 3px; border: #d9d9d9 1px solid; border-radius: 4px"
    >
      <div
        :style="{ background: color, borderRadius: '2px', height: '100%' }"
        @click="openColorPicker($event)"
      ></div>
    </div>
  </a-popover>
</template>

<style scoped>

</style>
