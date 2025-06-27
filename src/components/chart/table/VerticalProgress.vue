<script setup lang="ts">
// 颜色和进度 以及类型 type stage 、 linear
import {computed, ref} from 'vue'

// 已测试 分段 纯色 渐变色

let props = defineProps(['color', 'progress', 'type', 'colorDirection', 'borderColor'])

let containerStyle = computed(() => {
  let result: {
    backgroundColor?: string
    background?: string
    display?: string
    justifyContent?: string
    alignItems?: string,
    borderColor?: string,
  } = {}

  if (props.borderColor) {
    result.borderColor = props.borderColor
  } else {
    result.borderColor = '#f0f0f0'
  }

  if (props.type == 'linear-gradient') {
    result.display = 'flex'
    result.alignItems = 'start'
    result.background = `linear-gradient(${props.colorDirection},${props.color.join(',')})`
  } else {
    result.display = 'flex'
    result.alignItems = 'end'
    result.backgroundColor = '#ffffff'
  }
  return result
})

let innerStyle = computed(() => {
  let result: {
    height: string
    backgroundColor?: string
    background?: string
    borderRadius?: string
  } = {
    height: props.progress + '%',
  }

  if (props.type) {
    if (props.type == 'stages') {
      result.height = props.progress + '%'
      result.borderRadius = '4px'
      for (let i = 0; i < props.color.length; i++) {
        // 需要传递过来的颜色 是从小到大排序的 [[0.5,'red'],['0.8','yellow'],['1','yellow']]
        if (100 * props.color[i][0] >= props.progress) {
          result.backgroundColor = props.color[i][1]
          break
        }
      }
    } else if (props.type == 'linear-gradient') {
      result.height = 100 - props.progress + '%'
      result.backgroundColor = '#ffffff'
      // 尽可能覆盖掉内部的颜色
      result.borderRadius = '4px 4px 0 0'
    }
  } else {
    result.height = props.progress + '%'
    result.backgroundColor = props.color
    result.borderRadius = '4px'
  }
  return result
})
</script>

<template>
  <div class="progress-bar" :style="containerStyle">
    <div class="inner" :style="innerStyle"></div>
  </div>
</template>

<style scoped>
.progress-bar {
  height: 23px;
  width: 8px;
  border-radius: 4px;
  border: 1px solid;
}

.progress-bar:hover {
  scale: calc(1.3);
  z-index: 9;
}

.progress-bar .inner {
  width: 100%;
}
</style>
