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
        <path d="M256 64h768v128H256zM256 448h768v128H256zM256 832h768v128H256z" :fill="fill" />
        <path d="M0 256h128v512H0z"  fill="black" />
      </svg>
    </template>
  </icon>
</template>

<script setup lang="ts">
import Icon from '@ant-design/icons-vue'
</script>
