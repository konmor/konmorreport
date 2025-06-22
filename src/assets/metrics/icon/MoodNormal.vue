<script setup lang="ts">
import Icon from "@ant-design/icons-vue";
</script>

<template>
  <icon>
    <template #component="{fill,height,width,style}">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
           :width="width" :height="height" :style="style">
        <path
            d="M640 640h-256c-19.2 0-32 12.8-32 32s12.8 32 32 32h256c19.2 0 32-12.8 32-32s-12.8-32-32-32zM384 416v-32c0-19.2-12.8-32-32-32s-32 12.8-32 32v32c0 19.2 12.8 32 32 32s32-12.8 32-32z"
            :fill="fill"/>
        <path
            d="M512 64c-246.4 0-448 201.6-448 448s201.6 448 448 448 448-201.6 448-448-201.6-448-448-448z m0 832c-211.2 0-384-172.8-384-384s172.8-384 384-384 384 172.8 384 384-172.8 384-384 384z"
            :fill="fill"/>
        <path d="M672 352c-19.2 0-32 12.8-32 32v32c0 19.2 12.8 32 32 32s32-12.8 32-32v-32c0-19.2-12.8-32-32-32z"
              :fill="fill"/>
      </svg>
    </template>
  </icon>
</template>


