<template>
  <icon>
    <template #component="{fill,height,width,style}">
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 -960 960 960"
           :width="width" :height="height" :style="style">
        <path
            d="M293.54-215v-530H488q61.15 0 110.58 38.08Q648-668.85 648-604.38q0 44.84-21.66 73.11-21.65 28.27-46.65 41.04 30.77 10.61 58.77 41.96 28 31.35 28 84.42 0 76.69-56.54 112.77T496-215H293.54Zm86-79.69h113.23q47.23 0 66.77-26.23t19.54-50.31q0-24.08-19.54-50.31-19.54-26.23-68.62-26.23H379.54v153.08Zm0-230.31h103.77q36.46 0 57.81-20.85 21.34-20.84 21.34-49.92 0-30.92-22.57-50.54-22.58-19.61-55.35-19.61h-105V-525Z"
            :fill="fill"/>
      </svg>
    </template>
  </icon>
</template>

<script setup lang="ts">
import Icon from "@ant-design/icons-vue";
</script>
