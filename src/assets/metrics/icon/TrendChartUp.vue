<script setup lang="ts">
import Icon from "@ant-design/icons-vue";
</script>

<template>
  <icon>
    <template #component="{fill,height,width,style}">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
           :width="width" :height="height" :style="style">
        <path
            d="M928 361.6v182.4c0 19.2 12.8 32 32 32s32-12.8 32-32v-224c0-35.2-28.8-64-64-64h-224c-19.2 0-32 12.8-32 32s12.8 32 32 32h176l-272 272-204.8-204.8c-6.4-6.4-16-9.6-22.4-9.6-9.6 0-16 3.2-22.4 9.6l-316.8 316.8c-12.8 12.8-12.8 32 0 44.8 12.8 12.8 32 12.8 44.8 0l294.4-294.4 204.8 204.8c6.4 6.4 16 9.6 22.4 9.6 9.6 0 16-3.2 22.4-9.6l297.6-297.6z"
            :fill="fill"/>
      </svg>
    </template>
  </icon>
</template>


