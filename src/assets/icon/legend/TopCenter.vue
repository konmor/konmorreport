<template>
  <icon>
    <template #component="{ fill, height, width, style }">
      <svg
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        :width="width"
        :height="height"
        :style="style"
      >
        <path d="M256 64h512v128H256z" :fill="fill" />
        <path d="M0 448h1024v128H0zM0 832h1024v128H0z" :fill="fill" />
      </svg>
    </template>
  </icon>
</template>

<script setup lang="ts">
import Icon from '@ant-design/icons-vue'
</script>
