<script lang="ts">
export default {name: 'createSQL'}
</script>
<script setup lang="ts">
import SqlEditor from '@/components/sqlEditor.vue'
import {
  useRoute
} from "vue-router";
import {onMounted, ref, watch} from "vue";

let route = useRoute()

let sourceId = ref<string>('');
let sqlName = ref<string>('');
let dbId = ref<string>('');
// 添加对路由的监听
watch(
    () => route.query.key,
    (item) => {
      sourceId.value = item as string;
      sqlName.value = route.query.sqlName as string;
      dbId.value= route.query.dbId as string;
    }
)

onMounted(() => {
  sourceId.value = route.query.key as string;
  sqlName.value = route.query.sqlName as string;
  dbId.value= route.query.dbId as string;
})

</script>

<template>
  <sql-editor :sourceId="sourceId" :sqlName="sqlName" :dbId="dbId"></sql-editor>
</template>

<style scoped></style>
