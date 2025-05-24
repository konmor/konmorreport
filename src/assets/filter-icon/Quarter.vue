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
          d="M960 1024H64a64 64 0 0 1-64-64V128a64 64 0 0 1 64-64h64v128a64 64 0 0 0 64 64h64a64 64 0 0 0 64-64V64h384v128a64 64 0 0 0 64 64h64a64 64 0 0 0 64-64V64h64a64 64 0 0 1 64 64v832a64 64 0 0 1-64 64zM896 320H128v640h768V320z m-256 512a64 64 0 1 1 64 64 64 64 0 0 1-64-64z m64-128a127.68 127.68 0 0 0-116.992 179.2A253.056 253.056 0 0 1 512 896a256 256 0 1 1 256-256 253.056 253.056 0 0 1-12.8 75.008A126.848 126.848 0 0 0 704 704zM512 512a128 128 0 1 0 128 128 128 128 0 0 0-128-128z m256-320V0h64v192h-64zM192 192V0h64v192H192z"
          :fill="fill"
        />
      </svg>
    </template>
  </icon>
</template>

<script setup lang="ts">
import Icon from '@ant-design/icons-vue'
</script>
