<script setup lang="ts">
import Icon from "@ant-design/icons-vue";
</script>

<template>
  <icon>
    <template #component="{fill,height,width,style}">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
           :width="width" :height="height" :style="style">
        <path
            d="M224 704c-54.4 0-96 41.6-96 96v64c0 19.2 12.8 32 32 32h704c19.2 0 32-12.8 32-32v-64c0-54.4-41.6-96-96-96h-576z m0-64h576c89.6 0 160 70.4 160 160v64c0 54.4-41.6 96-96 96h-704c-54.4 0-96-41.6-96-96v-64c0-89.6 70.4-160 160-160z m192-512c-35.2 0-64 28.8-64 64v160c0 89.6 70.4 160 160 160s160-70.4 160-160v-160c0-35.2-28.8-64-64-64h-192z m0-64h192c70.4 0 128 57.6 128 128v160c0 124.8-99.2 224-224 224s-224-99.2-224-224v-160c0-70.4 57.6-128 128-128z"
            :fill="fill"/>
      </svg>
    </template>
  </icon>
</template>


