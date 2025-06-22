<script setup lang="ts">
import Icon from "@ant-design/icons-vue";
</script>

<template>
  <icon>
    <template #component="{fill,height,width,style}">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
           :width="width" :height="height" :style="style">
        <path
            d="M946.33106 697.353498 541.30749 284.093337c-15.690354-16.009625-41.469484-16.009625-57.160861 0l-405.024593 413.260162c-24.819269 25.323758-6.877641 68.028373 28.579919 68.028373l810.048163 0C953.209724 765.381871 971.150328 722.677257 946.33106 697.353498z"
            :fill="fill"/>
      </svg>
    </template>
  </icon>
</template>


