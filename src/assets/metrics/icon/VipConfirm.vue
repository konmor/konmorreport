<script setup lang="ts">
import Icon from "@ant-design/icons-vue";
</script>

<template>
  <icon>
    <template #component="{fill,height,width,style}">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
           :width="width" :height="height" :style="style">
        <path
            d="M160 704c-35.2 0-64 28.8-64 64v41.6c0 12.8 9.6 22.4 22.4 22.4h595.2c12.8 0 22.4-9.6 22.4-22.4v-41.6c0-35.2-28.8-64-64-64h-512z m0-64h512c70.4 0 128 57.6 128 128v41.6c0 48-38.4 86.4-86.4 86.4h-595.2c-48 0-86.4-38.4-86.4-86.4v-41.6c0-70.4 57.6-128 128-128z m620.8-89.6l156.8-156.8c12.8-12.8 32-12.8 44.8 0 12.8 12.8 12.8 32 0 44.8l-182.4 182.4c-6.4 6.4-16 9.6-22.4 9.6-6.4 0-16-3.2-22.4-9.6l-112-112c-12.8-12.8-12.8-32 0-44.8s32-12.8 44.8 0l92.8 86.4z m-444.8-422.4h156.8c64 0 112 51.2 112 112v144c0 105.6-86.4 192-192 192s-192-86.4-192-192v-144c3.2-60.8 54.4-112 115.2-112z m0 64c-25.6 0-48 22.4-48 48v144c0 70.4 57.6 128 128 128s128-57.6 128-128v-144c0-25.6-22.4-48-48-48h-160z"
            :fill="fill"/>
      </svg>
    </template>
  </icon>
</template>


