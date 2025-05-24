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
        <path
          d="M960 1024H64a64 64 0 0 1-64-64V128a64 64 0 0 1 64-64h64v128a64 64 0 0 0 64 64h64a64 64 0 0 0 64-64V64h384v128a64 64 0 0 0 64 64h64a64 64 0 0 0 64-64V64h64a64 64 0 0 1 64 64v832a64 64 0 0 1-64 64zM896 320H128v640h768V320zM416 448h128a32 32 0 0 1 0 64H448v64h96a32 32 0 0 1 32 32v128a32 32 0 0 1-32 32h-128a32 32 0 0 1 0-64H512v-64H416a32 32 0 0 1-32-32v-128a32 32 0 0 1 32-32zM768 192V0h64v192h-64zM192 192V0h64v192H192z"
          :fill="fill"
        />
      </svg>
    </template>
  </icon>
</template>

<script setup lang="ts">
import Icon from '@ant-design/icons-vue'
</script>
