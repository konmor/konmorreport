<script setup lang="ts">
import Icon from "@ant-design/icons-vue";
</script>

<template>
  <icon>
    <template #component="{fill,height,width,style}">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
           :width="width" :height="height" :style="style">
        <path
            d="M800 755.2l-572.8-572.8c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l572.8 572.8h-435.2c-19.2 0-32 12.8-32 32s12.8 32 32 32h480c35.2 0 64-28.8 64-64v-480c0-19.2-12.8-32-32-32s-32 12.8-32 32v435.2z"
            :fill="fill"/>
      </svg>
    </template>
  </icon>
</template>


