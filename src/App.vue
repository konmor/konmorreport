<script setup lang="ts">
import Navigator from '@/components/navigator.vue'
import { Button } from 'ant-design-vue'
</script>

<template>
  <!--  主题色-->
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#6aaf49',
      },
    }"
  >
  </a-config-provider>
  <div class="reports">
    <div class="navigator">
      <Navigator />
    </div>
    <div class="mainContent">
      <Button> hellofasdfdsa</Button>
    </div>
  </div>
</template>

<style scoped>
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

.reports {
  display: flex;
  margin: 0 auto;
  height: 100%;
  width: 1920px;
}

.navigator {
  width: 256px;
  height: 100%;
}

.mainContent {
  width: 1720px;
  height: 100%;
}
</style>
