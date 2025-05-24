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
          d="M960 1024H64a64 64 0 0 1-64-64V128a64 64 0 0 1 64-64h64v128a64 64 0 0 0 64 64h64a64 64 0 0 0 64-64V64h384v128a64 64 0 0 0 64 64h64a64 64 0 0 0 64-64V64h64a64 64 0 0 1 64 64v832a64 64 0 0 1-64 64zM896 320H128v640h768V320zM448 448l64 192 64-192h128l128 384h-128l-64-192-64 192H448l-64-192-64 192H192l128-384h128z m320-256V0h64v192h-64zM192 192V0h64v192H192z"
          :fill="fill"
        />
      </svg>
    </template>
  </icon>
</template>

<script setup lang="ts">
import Icon from '@ant-design/icons-vue'
</script>
