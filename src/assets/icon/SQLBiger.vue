<script setup lang="ts">
import Icon from "@ant-design/icons-vue";
</script>

<template>
  <icon>
    <template #component="{fill,height,width,style}">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
           :width="width" :height="height" :style="style">
        <path :fill="fill"
              d="M312 977.4H2.7v-29.3h266.7c19.5 1.8 28.4-6.2 26.7-24V801.4c1.8-19.5-6.3-28.4-24-26.7H85.3C28.4 774.7 0 744.5 0 684.1v-58.7c0-58.7 28.4-88 85.3-88h99.3v29.3H128c-17.8-1.7-25.8 7.1-24 26.7v125.3c-1.8 19.6 6.2 28.5 24 26.7h184c58.7 0 88 29.3 88 88v56c0 58.7-29.3 88-88 88zM672 988.1l-8-10.7H528c-58.7 0-88-30.2-88-90.7V625.4c0-58.7 29.3-88 88-88h256c58.7 0 88 29.3 88 88v261.3c0 60.5-29.3 90.7-88 90.7h-56l26.7 45.3c-44.5 5.4-72-6.2-82.7-34.6z m8-104l34.7 64h26.7c17.8 1.8 25.7-7.1 24-26.7v-328c1.7-19.5-6.3-28.4-24-26.7H570.7c-17.8-1.7-25.8 7.1-24 26.7v328c-1.8 19.6 6.2 28.5 24 26.7h80l-37.3-64H680zM1024 977.4H920V534.7h104v442.7z"
        />
        <path :fill="fill"
              d="M210.8 634l68.7-192.6 112 117.6-180.7 75zM414.4 536.8L301.5 418.3 608.6 98.6l113 118.5-307.2 319.7zM742.6 192.5L629.6 74l56.5-59.3c18.7-19.6 49-19.6 67.8 0l45.2 47.4c18.7 19.6 18.7 51.5 0 71.1l-56.5 59.3z"
        />
      </svg>
    </template>
  </icon>
</template>
