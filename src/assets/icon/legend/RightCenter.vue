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
        <path d="M0 64h768v128H0zM0 448h768v128H0zM0 832h768v128H0z" :fill="fill" />
        <path d="M896 256h128v512h-128z" :fill="fill" />
      </svg>
    </template>
  </icon>
</template>

<script setup lang="ts">
import Icon from '@ant-design/icons-vue'
</script>
