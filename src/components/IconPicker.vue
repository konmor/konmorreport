<script setup lang="ts">
import {ref} from "vue";
import {AllMetrics} from "@/assets/metrics/factory.ts";

let visible = ref<boolean>(false);

//　选中的icon 或者 标签
let props = defineProps(['icon', 'label']);

let a = defineEmits(['update:'])


AllMetrics


</script>

<template>

  <a-popover v-model:open="visible" trigger="click">
    <div>

    </div>
  </a-popover>

</template>

<style scoped>

</style>