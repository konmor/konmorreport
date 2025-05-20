<script lang="ts">
export default {name: 'editSQL'}
</script>
<script setup lang="ts">
import SqlEditor from '@/components/sqlEditor.vue'
import {
  useRoute
} from "vue-router";
import {onMounted, reactive, ref, watch} from "vue";
import type {SQLConfig} from "@/types/api.ts";
import {querySQLConfigDetail} from "@/api/sql.ts";
import {message} from "ant-design-vue";
import emitter from "@/utils/EventBus.ts";

let route = useRoute()
let sqlConfig = reactive<SQLConfig>({});
// 添加对路由的监听
watch(
    () => route.query.sqlId,
    (item) => {
      // 从数据库中重新查询数据
      sqlConfig.sqlId = item as string;
      getSQLConfig(sqlConfig.sqlId);
    }
)

onMounted(() => {
  sqlConfig.sqlId = route.query.sqlId as string;
  getSQLConfig(sqlConfig.sqlId);

})

function getSQLConfig(sqlId: string | number) {
  querySQLConfigDetail(sqlId).then((response) => {
    if (response.code == 0) {
      Object.assign(sqlConfig, response.data);
      emitter.emit('DBObject:refresh', sqlConfig.sourceId as string);
    } else {
      message.error('查询SQL配置失败！' + response.error);
    }
  }).catch((ex) => {
    console.error(ex);
    message.error('查询SQL配置失败！');
  })
}

</script>

<template>
  <sql-editor :sourceId="sqlConfig.sourceId" :sqlName="sqlConfig.sqlName" :dbId="sqlConfig.dbId"
              :sqlConfig="sqlConfig"></sql-editor>
</template>

<style scoped></style>

