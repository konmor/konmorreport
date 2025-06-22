<script setup lang="ts">
import Icon from "@ant-design/icons-vue";
</script>

<template>
  <icon>
    <template #component="{fill,height,width,style}">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
           :width="width" :height="height" :style="style">
        <path
            d="M259.2 144H160c-19.2 0-32 12.8-32 32v288c0 19.2 16 32 32 32h96v-352zM160 560c-54.4 0-96-41.6-96-96v-288c0-54.4 44.8-96 96-96h652.8c48 0 89.6 35.2 96 83.2l48 384v12.8c0 54.4-44.8 96-96 96h-217.6v160c0 70.4-57.6 128-128 128-12.8 0-22.4-6.4-28.8-16L272 560H160z m704 32c19.2 0 32-12.8 32-32v-3.2l-48-384c-3.2-16-16-28.8-32-28.8H323.2v374.4l211.2 358.4c28.8-6.4 48-32 48-60.8v-192c0-19.2 16-32 32-32H864z"
            :fill="fill"/>
      </svg>
    </template>
  </icon>
</template>


