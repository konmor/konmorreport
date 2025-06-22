<script setup lang="ts">
import Icon from "@ant-design/icons-vue";
</script>

<template>
  <icon>
    <template #component="{fill,height,width,style}">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
           :width="width" :height="height" :style="style">
        <path
            d="M512 0C229.216 0 0 229.216 0 512s229.216 512 512 512 512-229.216 512-512S794.784 0 512 0zM512 960C264.576 960 64 759.424 64 512S264.576 64 512 64s448 200.576 448 448S759.424 960 512 960z"
            :fill="fill"/>
        <path
            d="M512 384c-17.664 0-32 14.336-32 32l0 320c0 17.664 14.336 32 32 32s32-14.336 32-32L544 416C544 398.336 529.664 384 512 384z"
            :fill="fill"/>
        <path d="M512 288m-32 0a1 1 0 1 0 64 0 1 1 0 1 0-64 0Z"
              :fill="fill"/>
      </svg>

    </template>
  </icon>
</template>


