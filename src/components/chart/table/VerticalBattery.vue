<script setup lang="ts">
import {computed, ref} from 'vue'

// 已测试 分段 纯色 渐变色

let props = defineProps(['color', 'progress', 'type', 'colorDirection', 'borderColor']);

let containerStyle = computed(() => {
  let result = {
    borderColor: '#f0f0f0'
  }

  if (props.borderColor) {
    result.borderColor = props.borderColor
  } else {
    result.borderColor = '#f0f0f0'
  }
  return result;
})

let innerStyle = computed(() => {
  let result: {
    height?: string,
    width?: string,
    background?: string,
    backgroundColor?: string,
  } = {}

  if (props.type) {
    if (props.type == 'stages') {
      result.height = props.progress + '%';
      for (let i = 0; i < props.color.length; i++) {
        // 需要传递过来的颜色 是从小到大排序的 [[0.5,'red'],['0.8','yellow'],['1','yellow']]
        if (100 * props.color[i][0] >= props.progress) {
          result.backgroundColor = props.color[i][1]
          break
        }
      }
    } else if (props.type == 'linear-gradient') {
      result.height = '100%';
      result.background = `linear-gradient(${props.colorDirection},${props.color.join(',')})`
    }
  } else {
    result.height = props.progress + '%';
    result.backgroundColor = props.color
  }
  return result;
})

let maskStyle = computed(() => {

  if (props.type == 'linear-gradient') {
    return {
      height: (100 - props.progress) + '%',
      backgroundColor: '#fff',
      width: '100%',
      position: 'absolute',
      top: 0,
      right: 0,
    }
  }
  return null;
})


</script>

<template>
  <div class="battery-bar" :style="containerStyle">
    <div class="inner" :style="innerStyle"></div>
    <div class="items">
      <div
          class="item"
          v-for="i in 9"
          :style="{ position: 'absolute', top: i * 2 + 'px' }"
      ></div>
    </div>

    <div class="mask"  v-if="props.type == 'linear-gradient' " :style="maskStyle">

    </div>
  </div>
</template>

<style scoped>

.battery-bar {
  width: 8px;
  height: 23px;

  border-radius: 2px;
  border: 1px solid;

  padding: 1px 1px 1px 1px;
  position: relative;

  display: flex;
  align-items: end;
}
.battery-bar:hover {
  scale: calc(1.3);
  z-index: 9;
}
.battery-bar .inner {
  height: 100%;
  width: 100%;

}

.battery-bar .items {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.battery-bar .items .item {
  width: 6px;
  height: 1px;
  background-color: #fff;
}

</style>