<script setup lang="ts">
import { useRouter } from 'vue-router'
import { provide } from 'vue'

let router = useRouter()
provide('router', router)

</script>

<template>
  <router-view></router-view>
</template>

<style>

/*配置模态框 右侧超长滚动条*/
.verticalScrollBar::-webkit-scrollbar {
  width: 4px;
}

.verticalScrollBar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.verticalScrollBar::-webkit-scrollbar-track {
  background-color: #f0f0f0;
}

html,
body {
  height: 100%;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

li {
  list-style: none;
}
</style>
