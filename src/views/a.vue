<template>
  <a-layout ref="container" class="container">
    <!-- 上半部分 -->
    <a-layout-content :style="{ height: topHeight + 'px' }" class="top">
      上半部分内容
    </a-layout-content>

    <!-- 分割线 -->
    <div class="divider" @mousedown="startDrag"></div>

    <!-- 下半部分 -->
    <a-layout-content :style="{ height: bottomHeight + 'px' }" class="bottom">
      下半部分内容
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'

// 响应式数据
const topHeight = ref(300) // 上半部分初始高度
const bottomHeight = ref(300) // 下半部分初始高度
const isDragging = ref(false) // 是否正在拖拽
const container = ref(null) // 容器的引用

// 开始拖拽
const startDrag = (event) => {
  isDragging.value = true

  const onMouseMove = (e) => {
    if (isDragging.value && container.value) {
      const containerRect = container.value.getBoundingClientRect()
      const newTopHeight = e.clientY - containerRect.top // 计算新的上半部分高度
      const newBottomHeight = containerRect.height - newTopHeight // 计算新的下半部分高度

      // 确保高度不会超出范围
      if (newTopHeight > 50 && newBottomHeight > 50) {
        topHeight.value = newTopHeight
        bottomHeight.value = newBottomHeight
      }
    }
  }

  const onMouseUp = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 容器占满整个视口高度 */
}

.top,
.bottom {
  overflow: auto; /* 如果内容超出，显示滚动条 */
  padding: 16px;
  box-sizing: border-box;
}

.top {
  background-color: #f0f8ff; /* 浅蓝色背景 */
}

.bottom {
  background-color: #fff0f5; /* 浅粉色背景 */
}

.divider {
  height: 10px; /* 分割线高度 */
  background-color: #ccc; /* 分割线颜色 */
  cursor: row-resize; /* 鼠标悬停时显示调整图标 */
}
</style>
