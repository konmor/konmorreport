<template>
  <icon>
    <template #component="{fill,height,width,style}">
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 -960 960 960"
           :width="width" :height="height" :style="style">
        <path
            d="M315.08-230v-500H483q57.31 0 101.15 36.15Q628-657.69 628-599.77q0 38.69-20.31 67.73-20.31 29.04-50.31 42.58 36.54 10.23 62.04 42.92t25.5 78.85q0 64.38-48.07 101.04Q548.77-230 491-230H315.08Zm51-47.38h122.46q46.46 0 75.04-27.97 28.57-27.96 28.57-65.11 0-37.16-28.57-65.12-28.58-27.96-75.73-27.96H366.08v186.16Zm0-232.62h114.54q39.92 0 67.61-24.69 27.69-24.69 27.69-61.85 0-37.84-28.15-62.08-28.15-24.23-66.69-24.23h-115V-510Z"
            :fill="fill"/>
      </svg>
    </template>
  </icon>
</template>

<script setup lang="ts">
import Icon from "@ant-design/icons-vue";
</script>
