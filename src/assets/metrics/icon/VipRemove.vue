<script setup lang="ts">
import Icon from "@ant-design/icons-vue";
</script>

<template>
  <icon>
    <template #component="{fill,height,width,style}">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
           :width="width" :height="height" :style="style">
        <path
            d="M160 672c-35.2 0-64 28.8-64 64v41.6c0 12.8 9.6 22.4 22.4 22.4h595.2c12.8 0 22.4-9.6 22.4-22.4V736c0-35.2-28.8-64-64-64H160z m0-64h512c70.4 0 128 57.6 128 128v41.6c0 48-38.4 86.4-86.4 86.4H118.4C70.4 864 32 825.6 32 777.6V736c0-70.4 57.6-128 128-128z m544-160h256c19.2 0 32 12.8 32 32s-12.8 32-32 32h-256c-19.2 0-32-12.8-32-32s12.8-32 32-32zM336 160C310.4 160 288 182.4 288 208V352c0 70.4 57.6 128 128 128s128-57.6 128-128V208c0-25.6-22.4-48-48-48h-160z m0-64h156.8c64 0 112 51.2 112 112V352c0 105.6-86.4 192-192 192s-192-86.4-192-192V208C224 147.2 275.2 96 336 96z"
            :fill="fill"/>
      </svg>
    </template>
  </icon>
</template>


