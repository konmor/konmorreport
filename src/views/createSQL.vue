<script lang="ts">
export default {name: 'createSQL'}
</script>
<script setup lang="ts">
import SqlEditor from '@/components/sqlEditor.vue'
import {
  type NavigationGuardNext,
  onBeforeRouteLeave, onBeforeRouteUpdate,
  type RouteLocationNormalized,
  type RouteLocationNormalizedLoaded,
  useRoute
} from "vue-router";
import {onMounted, ref, watch} from "vue";

let route = useRoute()

let sourceId = ref<string>('');
let sqlName = ref<string>('');
// 添加对路由的监听
watch(
    () => route.query.key,
    (item) => {
      sqlName.value = route.query.sqlName as string;
      sourceId.value = item as string;
    }
)

onMounted(() => {
  sourceId.value = route.query.key as string;
  sqlName.value = route.query.sqlName as string;
})

</script>

<template>
  <sql-editor :sourceId="sourceId" :sqlName="sqlName"></sql-editor>
</template>

<style scoped></style>
