<script setup lang="ts">
import Icon from "@ant-design/icons-vue";
</script>

<template>
  <icon>
    <template #component="{fill,height,width,style}">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
           :width="width" :height="height" :style="style">
        <path
            d="M931.2 281.6c-9.6-9.6-22.4-9.6-35.2-6.4V224c0-54.4-41.6-96-96-96H224C169.6 128 128 169.6 128 224v54.4c-12.8-6.4-25.6-3.2-35.2 6.4-19.2 16-28.8 41.6-28.8 67.2v448c0 54.4 41.6 96 96 96h704c54.4 0 96-41.6 96-96V352c0-25.6-9.6-51.2-28.8-70.4zM441.6 678.4c38.4 38.4 99.2 38.4 134.4 0l57.6-57.6 217.6 208H172.8l211.2-211.2 57.6 60.8z m240-102.4l214.4-214.4v422.4L681.6 576zM224 192h576c19.2 0 32 12.8 32 32v112l-297.6 297.6c-12.8 12.8-32 12.8-44.8 0L384 531.2l-192-192V224c0-19.2 12.8-32 32-32z m115.2 384L128 787.2V364.8l211.2 211.2z"
            :fill="fill"/>
      </svg>
    </template>
  </icon>
</template>


