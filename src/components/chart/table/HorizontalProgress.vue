<script setup lang="ts">
// 颜色和进度 以及类型 type stage 、 linear
import { computed, ref } from 'vue'

// 已测试 分段 纯色 渐变色

let props = defineProps(['color', 'progress', 'type', 'colorDirection'])

let containerStyle = computed(() => {
  let result: {
    backgroundColor?: string
    background?: string
    display?: string
    justifyContent?: string
    alignItems?: string
  } = {}

  if (props.type == 'linear-gradient') {
    result.display = 'flex'
    result.justifyContent = 'flex-end'
    result.background = `linear-gradient(${props.colorDirection},${props.color.join(',')})`
  } else {
    result.backgroundColor = '#ffffff'
  }
  return result
})

let innerStyle = computed(() => {
  let result: {
    width: string
    backgroundColor?: string
    background?: string
    borderRadius?: string
  } = {
    width: props.progress + '%',
  }

  if (props.type) {
    if (props.type == 'stage') {
      result.width = props.progress + '%'
      result.borderRadius = '4px 0 0 4px'
      for (let i = 0; i < props.color.length; i++) {
        // 需要传递过来的颜色 是从小到大排序的 [[0.5,'red'],['0.8','yellow'],['1','yellow']]
        if (100 * props.color[i][0] > props.progress) {
          result.backgroundColor = props.color[i][1]
          break
        }
      }
    } else if (props.type == 'linear-gradient') {
      result.width = 100 - props.progress + '%'
      result.backgroundColor = '#ffffff'
      result.borderRadius = '0'
    }
  } else {
    result.width = props.progress + '%'
    result.backgroundColor = props.color
    result.borderRadius = '4px 0 0 4px'
  }
  return result
})
</script>

<template>
  <div class="progress-bar" :style="containerStyle">
    <div class="inner" :style="innerStyle"></div>
  </div>
  <!--  todo 显示百分比和当前值-->
  <!--  <div><span>hello,world</span></div>-->
</template>

<style scoped>
.progress-bar {
  height: 8px;
  width: 23px;
  border-radius: 4px;
  border: 1px solid;
  border-color: #f0f0f0;
}

.progress-bar:hover {
  scale: calc(1.3);
  z-index: 9;
}

.progress-bar .inner {
  height: 100%;
}
</style>
